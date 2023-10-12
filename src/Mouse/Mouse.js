import React, { useEffect, useState } from "react";
import { useBoolean } from "ahooks";

import './Mouse.css';

const Mouse = () => {
  const [data, setData] = useState([]);
  const [isSelect, {setTrue, setFalse}] = useBoolean(false);

  useEffect(() => {
    const newData = new Array(7).fill([]);
    newData.forEach(item => item.push({isMove: false}))
    setData(newData)
  }, [])

  const onMouseDown = () => {
    console.log('in-wrapper-down===');
    setTrue();
  }

  const onMouseLeave = () => {
    setFalse()
  }

  const onMouseUp = () => {
    console.log('in====');
    setFalse();
  }

  const onMouseOver = (e, item, wrapperIndex, itemIndex) => {
    e.preventDefault();
    const newData = JSON.parse(JSON.stringify(data))
    if (isSelect && !item.isMove) {
      newData[wrapperIndex][itemIndex].isMove = true;
      setData(newData)
    }
  }

  const onMouseItemDown = (e, item, wrapperIndex, itemIndex) => {
    const newData = JSON.parse(JSON.stringify(data))
    if (!item.isMove) {
      newData[wrapperIndex][itemIndex].isMove = true;
      setData(newData)
    }
  }


  return (
    <div className="mouse-wrapper"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
    >
      {
        data.map((item, wrapperIndex) => (<div className="mouse-column" key={`wrapper${wrapperIndex}`}>
          {
            item.map((i,index) => (<span
              key={`item${wrapperIndex}${index}`}
              className={i.isMove ? 'mouse-checked mouse-item' : 'mouse-item'}
              onMouseDown={(e) => onMouseItemDown(e, i, wrapperIndex, index)}
              onMouseOver={(e) => onMouseOver(e, i, wrapperIndex, index)}
            >{<span
              style={{width: '100%', height: '100%', display: 'inline-block'}}
              onClick={(e) => {
                e.stopPropagation();
              return false
            }}>{index}</span>}</span>))
          }
        </div>))
      }
    </div>
  );
}

export default Mouse;
