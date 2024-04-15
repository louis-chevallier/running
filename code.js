const pw_t  = document.getElementById('pw');
const encode  = document.getElementById('encode');
const decode  = document.getElementById('decode');
const message  = document.getElementById('message');
const encoded = document.getElementById('encoded');
const decoded = document.getElementById('decoded');

const char =  (c, _) => c.charCodeAt(0)
const [ca, cz, c0, c9] = [...'az09'].map(char)

console.log(ca, cz, c0, c9)

const alpha = [...Array(cz-ca+1).keys()].map(i => String.fromCharCode(i + ca));
const digits = [...Array(c9-c0+1).keys()].map(i => String.fromCharCode(i + c0));
const letters = [...alpha, ...digits, ..."&+=_-* "]
console.log(letters)
const lletters = letters.length

const pw = pw_t.value;
console.log(pw)


function dec_l(c, i, ppw) {
    const pwa = [...ppw];
    const lpw = pw.length;

    const ii =  letters.indexOf(c);
    const dec = letters.indexOf(pwa[i %lpw]);
    return letters[(ii+dec) % lletters]
}

function enc_l(c, i, ppw) {
    const pwa = [...ppw];
    const lpw = pwp.length;
    
    const ii =  letters.indexOf(c);
    const dec = letters.indexOf(pwa[i %lpw]);
    const e = letters[(ii+dec) % lletters]    
    return e;
}

const m = message.value;
console.log([..."louis"].map((c, i) => enc_l(c,i,pw)).join(""))
console.log([..."xxxxxxxxx"].map((c, i) => enc_l(c, i, pw)).join(""))

function process(event) {
    const m = message.value;
    const pw = pw_t.value;    
    console.log(m);
    const ee = [...m].map((c, i) => enc_l(c, i, pw)).join("");
    console.log(ee);
    encoded.innerHTML = ee;
};

message.addEventListener('input', process)
pw_t.addEventListener('input', process)

decode.addEventListener('click', function (event) {

});

