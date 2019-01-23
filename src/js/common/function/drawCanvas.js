import Canvas from '../class/canvas.js'
import Wave from '../class/wave.js'
import valueMapping from './valueMapping'

export default drawCanvas

function drawCanvas() {
    // console.log(1)
    var Cava = new Canvas("canvas");
    let canvas = Cava.init();
    // console.log(Cava)
    const gradients = [
        ['#b7472a', '#88d3ce'],
        ['#de6262', '#ffb88c'],
        ['#64b3f4', '#ff482c'],
        ['#0fd850', '#f9f047'],
        ['#007adf', '#e84e68'],
        ['#B6CEE8', '#F578DC'],
        ['#9be15d', '#f731fe']
    ];

    let waves = [];

    const init = () => {
        waves = [];
        for (let i = 0; i < 5; i++) {
            const [start, stop] = gradients[Math.floor(Math.random() * gradients.length)]
            waves.push(new Wave(Cava, {
                start,
                stop,
                lineWidth: 0.25,
                xSpeed: valueMapping(Math.random(), 0, 1, -0.05, -0.08),
                amplitude: valueMapping(Math.random(), 0, 1, 0.05, 0.5),
                offset: Math.random() * 100
            }))
        }
    };

    init();

    Cava.run(canvas => {
        canvas.clearRect(0, 0, Cava.width, Cava.height)
        waves.forEach(wave => {
            wave.draw(canvas)
        })
    })
}
