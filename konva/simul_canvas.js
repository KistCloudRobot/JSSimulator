var environment;
function initializeCanvas(containter_id) {
    environment = env;


}

class SimulatorCanvas {
    
    constructor(containter_id) {
        const container = document.getElementById(containter_id);
        console.log(container);
        this.objects = {}

        this.stage = new Konva.Stage({
            container: containter_id,
            width: container.offsetWidth,
            height: container.offsetHeight
        });
    }

    setLocation(k_obj, simul_point) {
        if (false) {
        const scale = this.stage.width() / 28; 
        const mid_y = this.stage.height() / 2;
        const x = (simul_point.x - 150) * scale + this.stage.width()/10;
        const y = (147-simul_point.y) * scale + this.stage.width()/2;
        k_obj.x(x);
        k_obj.y(y);
        }
        else {
        const scale_x = this.stage.width() / 24.9; 
        const scale_y = this.stage.width() / 26.3; 
        const mid_y = this.stage.height() / 2;
        const x = (simul_point.x - 150) * scale_x + this.stage.width()*0.02;
        const y = (-simul_point.y - 138.3) * scale_y;
        //const y = (simul_point.y - 138) * scale_y;// + this.stage.width()*0.778;
        k_obj.x(x);
        k_obj.y(y);
        }
    }


    onConnected(env) {
        var layer = new Konva.Layer();
    
        this.top = 0;
        this.left = 9999999;
        for (let obj of env.objectsList) {
            if (obj.type != "Product") {
                let k_obj = this.createObject(obj, layer);
                for (let p of obj.propertyMap) {
                    if (p[0] == 'edges') {
                        let peers = p[1].split(',');
                        for (let peer_id of peers) {
                            let peer = this.objects[peer_id];
                            if (peer) {
                                var line = new Konva.Line({
                                    points: [peer.x(), peer.y(), k_obj.x(), k_obj.y()],
                                    stroke: 'green',
                                    strokeWidth: 1
                                });
                                layer.add(line)
                            }
                        }
                    }
                }
            }
        }
        for (let obj of env.objectsList) {
            if (obj.type == "Product") {
                this.createObject(obj, layer);
            }
        }

        for (let p in this.objects) {
            var group = this.objects[p];

            if (group.type == "Robot" || group.type == "Vertex") {
                var text = new Konva.Text({
                    text: group.name,
                    fontSize: 12,
                    align: 'center',
                    fontFamily: 'Calibri',
                    width: 100,
                    offsetX: 50,
                    height: 50
                });

                if (group.type == "Robot") {
                    text.offsetY(5);
                    group.add(text);
                }
                else {
                    text.offsetY(15);
                    text.x(group.x());
                    text.y(group.y());
                    layer.add(text);
                }
            }
        }

        this.stage.add(layer);

        const canvas = this;
        this.lastFrame = 0;
        var anim = new Konva.Animation((frame) => {
            const scale = canvas.stage.width() / 1000 / 480;
            const interval = frame.time - canvas.lastFrame;
            canvas.lastFrame = frame.time;
            for (const p in canvas.objects) {
                var k_obj = canvas.objects[p];
                
                if (k_obj.moveX != 0 || k_obj.moveY != 0) {
                    const xx = interval * k_obj.moveX * scale;
                    const yy = interval * k_obj.moveY * scale;
                    // console.log(`move ${frame.time / 1000} ${k_obj.x()} -> ${xx} ${k_obj.y()} -> ${yy}`)
                    k_obj.x(k_obj.x() + xx);
                    k_obj.y(k_obj.y() + yy);
                }
                if (k_obj.rotateSpeed) {
                    k_obj.rotation(k_obj.rotation() + k_obj.rotateSpeed * interval / 800)
                }
            }

        }, layer);
        anim.start();
    }

    createObject(obj, layer_) {
        var k_obj = null;
        var showText = false;
        switch (obj.type) {
            case "Vertex":
                k_obj = this.createRect(5, 5, 'black');
                showText = true;
                break;
            case "Station":
                k_obj = this.createRect(20, 20, '#03c6fc');
                break;
            case "Charger":
                k_obj = this.createRect(20, 20, '#28fc03');
                break;
            case "Product":
                k_obj = this.createRect(10, 10, 'red');
                break;
            case "Door":
                k_obj = this.createRect(50, 5, 'green');
                break;
            case "Robot":
                k_obj = this.createRect(16, 16, '#fcba03');
                showText = true;
                break;
            case "Lion":
                k_obj = this.createLion(obj);
                break;
            default:
                return null;
                alert("error")
        }
        // return k_obj;
        var group = new Konva.Group({
        });

        group.type = obj.type;
        group.name = obj.name;
        group.moveX = 0;
        group.moveY = 0;

        group.add(k_obj);
        layer_.add(group);

        this.setLocation(group, obj.position)
        console.log(obj);
        this.objects[obj.objectid] = group;

        return group;
    }
    
    createRect(w, h, color) {
        var rect = new Konva.Rect({
            offsetX: w / 2,
            offsetY: h / 2,
            width: w,
            height: h,
            fill: color,
            rotation: 0,
        });
        return rect;
    }    


    createHexagon(obj) {
        var hexagon = new Konva.RegularPolygon({
            x: stage.width() / 2,
            y: stage.height() / 2,
            sides: 6,
            radius: 20,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            opacity: 0.5
        });
        return hexagon;
    }


    onModified(dumpEnv) {
        for (const obj of dumpEnv.objectsList) {
            const k_obj = this.objects[obj.objectid];
            if (k_obj.moveX == 0 && k_obj.moveY == 0) {
                this.setLocation(k_obj, obj.position);
            }
        }
    }   
    
    onChanged(change) {
        console.log("change  *** " + change.objectid)
        const k_obj = this.objects[change.objectid];
        console.log(change)
        if (k_obj != null) {
            switch (change.content) {
                case "turn":
                    k_obj.rotateSpeed = change.movement.x;// / 180; 
                    k_obj.rotateTo = -change.movement.y;
                    break;
                case "endTurn":
                    k_obj.rotateSpeed = 0; 
                    k_obj.rotation(k_obj.rotateTo);
                    //k_obj.rotateTo;
                    break;

                case "move":
                    k_obj.moveX = change.movement.x * 18;
                    k_obj.moveY = -change.movement.y * 18;
                    k_obj.startTime = 0;
                    break;
                case "endMove":
                    k_obj.moveX = 0;
                    k_obj.moveY = 0;
                    this.setLocation(k_obj, change.location);
                    break;
            }
        }
    }   
}