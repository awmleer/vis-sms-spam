const timeRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

const App = function() {
  const [time, setTime] = React.useState(0)
  const [type, setType] = React.useState(5)
  const [autoPlay, setAutoPlay] = React.useState(false)

  React.useEffect(() => {
    fetch('./data/newdata2.json').then(async (res) => {
      const data = await res.json()
      for (const time of timeRange) {
        setTimeout(() => {
          draw(time, data[time], type)
        }, time*2000)
      }
    })
  }, [type])

  React.useEffect(() => {
    if (!autoPlay) return
    let t = time
    const interval = setInterval(() => {
      t = (t+1) % 24
      setTime(t)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [autoPlay])

  function handleSliderChange(e) {
    setTime(e.target.value)
  }
  function handleAutoPlayChange(e) {
    setAutoPlay(e.target.checked)
  }

  function handleTypeChange(e) {
    setType(e.target.value);
  }

  return (
    <div>
      <div id="draw-area">
        {timeRange.map((t) => (
          <div id={`draw-area-${t}`} key={t} className="draw-area" style={{zIndex: t==time?100:1}} />
        ))}
      </div>
      <div id="toolbar">
        <input type="checkbox" checked={autoPlay} onChange={handleAutoPlayChange} /> Auto Play
        <input type="range" min="0" max="23" value={time} onChange={handleSliderChange} className="slider" />
        <span>{time}:00 - {time}:59</span>
          &nbsp;&nbsp;类型：
          <select onChange={handleTypeChange} value={type}>
            <option value="5" selected={"5" == type}>所有</option>
            <option value="6" selected={"6" == type}>主要类型</option>
            <option value="0" selected={"0" == type}>色情广告</option>
            <option value="1" selected={"1" == type}>发票办证</option>
            <option value="2" selected={"2" == type}>银行相关</option>
            <option value="3" selected={"3" == type}>房产交易</option>
            <option value="4" selected={"4" == type}>其他</option>
          </select>
      </div>
    </div>
  );
}


const domContainer = document.querySelector('#app');
ReactDOM.render(
  <App />,
  domContainer
);
