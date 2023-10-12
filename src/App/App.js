import React, { useState } from "react";
import { useRequest } from 'ahooks'
import axios from 'axios';
import './App.css';

const App = () => {
  const codes = [
    "161725",
    "270042",
    "260108",
    "003096",
    "001475",
    "162703",
    "519005",
    "320007",
    "003834",
    "003304",
    "167301",
    "009644",
    "003634",
    "164402",
    "011102",
    "519674",
    "000689",
    "010434",
    "002091",
    "161226",
    // new
    "001027",
    "000248",
    "001551",
    "161726",
  ];
  const errorCode = []
  const [data, setData] = useState([])

  const { run } = useRequest((needSort) => {
    const reqs = codes.map(item => axios.get(`http://localhost:8001/getNum?id=${item}`))
    return Promise.allSettled(reqs)
  }, {
    onSuccess: (res, params) => {
      const fundList = [];
      const needSort = params[0]
      res.filter(item => item.status === "fulfilled").forEach(item => {
        const { data: { data: result = {} } } = item.value;
        const fundStrings = /jsonpgz\((.*)\);/.exec(result) || [];
        const fundString = fundStrings.length === 2 ? fundStrings[1] : '';
        if (fundString) {
          const fundInfo = JSON.parse(fundString);
          fundList.push(fundInfo);
        } else {
          // 获取当前页面的URL
          const url = new URL(item.value.config.url);
          // 获取查询参数
          const searchParams = new URLSearchParams(url.search);
          // 获取特定的查询参数值
          const id = searchParams.get('id');
          errorCode.push(id)
        }
      })
      if (needSort) {
        setData(fundList.sort((a, b) => b.gszzl - a.gszzl))
      } else {
        setData(fundList)
      }
      console.log('errorCode', errorCode);
    }
  })

  const sortData = () => {
    run(true);
  }

  return (
    <div className="wrapper">
      <div className="app">
        {data.map(item => <div className="app-item" key={item.name}>
          <span>{item.name}</span>
          <span className={item.gszzl > 0 ? "app-red" : "green"}>{`${item.gszzl}%`}</span>
        </div>)}
      </div>
      <div className="operate">
        <button onClick={sortData}>刷新并排序</button>
        <div>{`code: ${codes.length}, data:${data.length}`}</div>
      </div>
    </div>
  );
}

export default App;
