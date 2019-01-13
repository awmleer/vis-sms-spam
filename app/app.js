const timeRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

const App = function() {
  const [time, setTime] = React.useState(0)
  React.useEffect(() => {
    fetch('./data/all.json').then(async (res) => {
      const data = await res.json()
      for (const time of timeRange) {
        setTimeout(() => {
          draw(time, data)
        }, time*3000)
      }
    })
  }, [])

  function handleSliderChange(e) {
    console.log(e.target.value)
    setTime(e.target.value)
  }

  return (
    <div>
      <div id="draw-area">
        {timeRange.map((t) => (
          <div id={`draw-area-${t}`} key={t} className="draw-area" style={{zIndex: t==time?100:1}} />
        ))}
      </div>
      <div id="toolbar">
        <div>
          <input type="range" min="0" max="23" value={time} onChange={handleSliderChange} className="slider" />
          <span>{time}:00 - {time}:59</span>
        </div>
      </div>
    </div>
  );
}


const domContainer = document.querySelector('#app');
ReactDOM.render(
  <App />,
  domContainer
);
