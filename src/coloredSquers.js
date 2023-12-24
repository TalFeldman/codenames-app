
export default function ColoredSquers({arr}){


    return(
        <div className='square-container'>
            <div className='colored-square' style={{ border: `solid 2px ${arr[0].begginer}`}}>
                {arr.map((cell, index) => (
                    <div className='small-square' style={{ backgroundColor: cell.color }}></div>
                ))}
            </div>
        </div>
    )
}