import React from 'react'

const ToggleView = ({explicitView, setExplicitView}) => {
  let classes = 'button button--secondary button--small'
  return (
    <div className="toggle-view">
      <button onClick={() => setExplicitView(false)} className={(explicitView) ? classes : `${classes} selected`}>Skjul tall</button>
      <button onClick={() => setExplicitView(true)} className={(explicitView) ? `${classes} selected` : classes}>Vis tall</button>
    </div>
  )
}

export default ToggleView
