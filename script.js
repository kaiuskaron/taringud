import { CountUp } from './countUp.min.js';

const sisend = document.getElementById('sisend')
const tulemus = document.getElementById('tulemus')
const puhasta = document.getElementById('puhasta')
const veereta = document.getElementById('veereta')
let summad = [];
let taringud = [];
const lubatud = [4, 6, 8, 10, 12, 20];

puhasta.addEventListener('click', () => {
    sisend.value = '';
    tulemus.innerHTML = '';
})

veereta.addEventListener("click", veerata)

async function veerata() {
    tulemus.innerHTML = '';
    summad = [];
    taringud = [];
    const tmp_taringud = sisend.value.split('+').map(e => e.trim());
    if (tmp_taringud.length > 0) {
        tmp_taringud.forEach((taring) => {
            const [korda, tyyp] = taring.split('d', 2).map(Number);
            if (lubatud.includes(tyyp) && korda > 0) {
                for (let i = 0; i < korda; i++) {
                    taringud.push(
                        { type: tyyp, score: Math.floor(Math.random() * tyyp) + 1 }
                    );
                }
            }
        })

        for await (const [index, taring] of taringud.entries()) {
            await joonista(taring, index)
        }

        if (summad.length) {
            tulemus.innerHTML += '<br><strong>Kokku: '
                + summad.join(' + ')
                + ' = '
                + summad.reduce((a, b) => {
                    return a + b
                })
                + '</strong>';
        }
    }
}

async function joonista(taring, index) {
    return new Promise((resolve) => {
        const lid = document.createElement('div');
        lid.classList.add('rida');
        const lis = document.createElement('span');
        lis.classList.add('score');
        lis.id = 't' + index.toString();
        lis.innerText = taring.score.toString();
        lid.innerHTML = '<div class="dice">' + taring.type.toString() + '</div> skoor: ';
        lid.appendChild(lis);
        tulemus.appendChild(lid);
        summad.push(taringud[index].score);

        const myCountUp = new CountUp('t' + index.toString(), taring.score, { duration: taring.type / 10 });
        myCountUp.start(() => {
            if (taring.type === 20) {
                if (taring.score === 1) {
                    lid.innerHTML += ' <span class="critical">(critical miss)</span>';
                } else if (taring.score === 20) {
                    lid.innerHTML += ' <span class="critical">(critical hit)</span>';
                }
            }
            resolve()
        });
    })
}

