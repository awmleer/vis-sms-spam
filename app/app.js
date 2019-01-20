const timeRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
//FIXME
// const timeRange = [0, 1]

const Spinner = function (props) {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="rect1"/>
        <div className="rect2"/>
        <div className="rect3"/>
        <div className="rect4"/>
        <div className="rect5"/>
      </div>
      <div className="progress">
        {props.current} / {props.total}
      </div>
    </div>
  )
}

const App = function() {
  const [loadingProgress, setLoadingProgress] = React.useState(0)
  const [time, setTime] = React.useState(0)
  const query = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [type, setType] = React.useState(query.type || 5)
  const [autoPlay, setAutoPlay] = React.useState(false)


  React.useEffect(() => {
    fetch('./data/newdata3.json').then(async (res) => {
      const data = await res.json()
      for (const time of timeRange) {
        setTimeout(() => {
          setLoadingProgress(time + 1)
          if (time === timeRange[timeRange.length - 1]) {
            setTimeout(() => {
              setLoadingProgress(time + 2)
            }, 1500)
          }
          if (time === 24)
            draw(24, data[24], type);
          else
            draw(time, data[(time + 16) % 24], type)
        }, time*1500)
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

  React.useEffect(() => {
    const canvas = document.getElementById('draw-area-right')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }, [time])

  function handleSliderChange(e) {
    setTime(e.target.value)
  }
  function handleAutoPlayChange(e) {
    setAutoPlay(e.target.checked)
  }

  function handleTypeChange(e) {
    location.replace(`${location.pathname}?type=${e.target.value}`)
  }

  function handleMapClick(event) {
    console.log(event)
  }

  return (
    <div>
      {loadingProgress <= timeRange.length && (
        <Spinner total={timeRange.length} current={loadingProgress}/>
      )}
      <div id="draw-area">
        {timeRange.map((t) => (
          <div id={`draw-area-${t}`} key={t} className="draw-area" style={{zIndex: t==time?100:1}} />
        ))}
      </div>
      <div id="toolbar">
        <input type="checkbox" checked={autoPlay} onChange={handleAutoPlayChange} /> Auto Play
        <input type="range" min="0" max="24" value={time} onChange={handleSliderChange} className="slider" />
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
