import React, {useMemo} from 'react'



export default function Images({id, name}) {

    const link = useMemo(() => {
        let arrOfCharHex = ['a', 'b', 'c', 'd', 'e', 'f']
        let bgArrPossible = (id) ? id.split('') : ['f', 'a', 'e'];

        let bgArr = [];
        let numBg = [];

        bgArrPossible.forEach(el => {
            el = el.toLowerCase();

            if(bgArr.length < 6) {
                if (arrOfCharHex.some(el0 => el0 === el) || el > 7) {
                    bgArr.push(el);
                } else if(el > 0) {
                    numBg.push(el);
                }
            }
        });

        while (bgArr.length < 6) {
            if (numBg.length > 0) {
                bgArr.push(''+numBg.pop());
            } else {
                bgArr.push('0');
            }
        }

        let bgHex='';

        bgArr.forEach(el => bgHex+=el)

        let colorW = false;
        let cont = ['b', 'c', 'e', 'f']
        for (let i = 0; i<6 && !colorW; i=i+2) {
            let t = bgArr[i];
            colorW = cont.some(el => el === t);
        }

        let color = (!colorW) ? 'FFF' : '000'


        let arrName = (name) ? name.split('') : ['J', 'D'];
        let myName = arrName[0] + arrName.pop();


        return `https://ui-avatars.com/api/?name=${myName}&background=${bgHex}&color=${color}`;
    
    }, [id, name]);

    return (
        <img src={link} alt={name || 'no name'} />
    )
}
