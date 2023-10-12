import React, { useState } from "react";
import { useRequest } from 'ahooks'
import axios from 'axios';
import './Dlt.css';

const Dlt = () => {
  const [result, setResult] = useState([]);
  const [inp, setInp] = useState("")
  const [money, setMoney] = useState([])
  const [hot, setHot] = useState({ red: [], blue: [] })

  useRequest(() => {
    return axios.get(`http://localhost:8001/getDlt`)
  }, {
    onSuccess: (res) => {
      const { data: { data } = {} } = res;
      const lotteryDrawResult = [];
      const calcData = [];
      data.forEach(item => {
        lotteryDrawResult.push({
          lotteryDrawResult: item.lotteryDrawResult.split(" "),
          lotteryDrawNum: item.lotteryDrawNum
        })
        calcData.push(item.lotteryDrawResult.split(" "))
      })
      setResult(lotteryDrawResult)
      calculate(calcData)
    }
  })

  const rule = (num, curNum) => {
    const reds = num.slice(0, 5);
    const blues = num.slice(-2);
    const curReds = curNum.slice(0, 5).map(i => parseInt(i));
    const curBlues = curNum.slice(-2).map(i => parseInt(i));;
    const redNum = reds.filter(i => curReds.includes(parseInt(i)))
    const blueNum = blues.filter(i => curBlues.includes(parseInt(i)))
    switch (`${redNum.length}+${blueNum.length}`) {
      case '5+2':
        return '一';
      case '5+1':
        return '二';
      case '5+0':
        return '三';
      case '4+2':
        return '四';
      case '4+1':
        return '五';
      case '3+2':
        return '六';
      case '4+0':
        return '七';
      case '3+1':
      case '2+2':
        return '八';
      case "3+0":
      case "1+2":
      case "0+2":
      case "2+1":
        return "九"
      default:
        return null;
    }
  }

  const calculate = (data) => {
    let red = new Array(35).fill({}).map((_, i) => ({ num: 0, index: i + 1 }))
    let blue = new Array(12).fill({}).map((_, i) => ({ num: 0, index: i + 1 }))
    data.forEach(arr => {
      arr.forEach((i, index) => {
        const num = parseInt(i) - 1;
        if (index < 5) {
          red[num].num++;
        } else {
          blue[num].num++;
        }
      })
    })
    setHot({
      red: red.sort((a, b) => a.num - b.num),
      blue: blue.sort((a, b) => a.num - b.num)
    })
  }

  const checkNum = (num) => {
    const moneyRes = [];
    result.forEach(item => {
      const isM = rule(num, item.lotteryDrawResult);
      if (isM) {
        moneyRes.push({
          lotteryDrawNum: item.lotteryDrawNum,
          money: isM
        })
      }
    })
    setMoney(moneyRes)
  }

  const onSearchClick = () => {
    const num = inp.split(" ");
    if (num.length !== 7) {
      console.error('填写内容不对');
    }
    checkNum(num)
  }

  const randomNum = () => {
    let redHot = [], redCold = [], blue = [];
    const redHotData = hot.red.slice(-10).map(item => item.index);
    const redCodeData = hot.red.slice(0, 15).map(item => item.index);
    const blueHotData = hot.blue.slice(-6).map(item => item.index);
    const blueCodeData = hot.blue.slice(0, 6).map(item => item.index);
    new Array(2).fill(0).forEach(i => {
      const redHotNum = Math.floor(Math.random() * redHotData.length);
      redHot.push(redHotData[redHotNum]);
      redHotData.splice(redHotNum, 1);
    })
    new Array(3).fill(0).forEach(i => {
      const redColdNum = Math.floor(Math.random() * redCodeData.length);
      redCold.push(redCodeData[redColdNum]);
      redCodeData.splice(redColdNum, 1);
    })
    blue.push(blueHotData[Math.floor(Math.random() * blueHotData.length)], blueCodeData[Math.floor(Math.random() * blueCodeData.length)])
    setInp([...[...redHot, ...redCold].sort((a,b) => parseInt(a) - parseInt(b)), ...blue.sort((a,b) => parseInt(a) - parseInt(b))].join(' '))
  }

  return (
    <div className="wrapper">
      <div className="dlt">
        {result.map(item => <div className="dlt-item" key={item.lotteryDrawNum}>
          <span>{`${item.lotteryDrawNum}：`}</span>
          <span>{item.lotteryDrawResult.slice(0, 5).map(i => (<span className="red dlt-num">{i}</span>))}</span>
          <span>+</span>
          <span>{item.lotteryDrawResult.slice(-2).map(i => (<span className="blue dlt-num">{i}</span>))}</span>
        </div>)}
      </div>
      <div className="right-wrapper">
        <div className="operate-dlt">
          <span>空格间隔</span>
          <input type="text" onChange={(v) => setInp(v.target.value)} value={inp}></input>
          <button onClick={onSearchClick}>查询</button>
        </div>
        <div className="jj-wrapper">
          {
            money.map(item => <div>
              <span>{`${item.lotteryDrawNum}期：`}</span>
              <span>{`${item.money}等奖`}</span>
            </div>)
          }
        </div>
        <div className="hot">
          <div><span>号码出现频率</span><button onClick={randomNum}>随机一注</button></div>
          <div className="num-wrapper">
            <div className="num-content">
              <span>红区</span>
              {
                hot.red.map(item => (<div>
                  <span>{`数字${item.index}:`}</span>
                  <span>{`出现${item.num}`}</span>
                </div>))
              }
            </div>
            <div className="num-content">
              <span>蓝区</span>
              {
                hot.blue.map(item => (<div>
                  <span>{`数字${item.index}:`}</span>
                  <span>{`出现${item.num}`}</span>
                </div>))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dlt;
