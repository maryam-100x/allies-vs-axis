const BattleMeter = ({ alliesCap, axisCap }) => {
  const total = alliesCap + axisCap
  const alliesPercent = total === 0 ? 50 : (alliesCap / total) * 100
  const axisPercent = 100 - alliesPercent

  return (
    <div style={{
      height: '30px',
      width: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, rgba(0,170,255,0.1) 0%, rgba(255,0,0,0.1) 100%)',
        zIndex: 1
      }} />
      
      <div
        style={{ 
          position: 'absolute',
          height: '100%',
          width: `${alliesPercent}%`,
          left: 0,
          top: 0,
          background: 'linear-gradient(90deg, rgba(0,170,255,0.8) 0%, rgba(0,123,255,0.8) 100%)',
          boxShadow: '0 0 20px rgba(0, 170, 255, 0.5)',
          transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '15px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textShadow: '0 0 5px rgba(0,0,0,0.5)'
        }}
      >
        {alliesPercent > 15 ? `${alliesPercent.toFixed(1)}%` : ''}
      </div>
      
      <div
        style={{ 
          position: 'absolute',
          height: '100%',
          width: `${axisPercent}%`,
          right: 0,
          top: 0,
          background: 'linear-gradient(90deg, rgba(255,51,102,0.8) 0%, rgba(255,0,0,0.8) 100%)',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '15px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textShadow: '0 0 5px rgba(0,0,0,0.5)'
        }}
      >
        {axisPercent > 15 ? `${axisPercent.toFixed(1)}%` : ''}
      </div>
      
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: '2px',
        background: 'rgba(255,255,255,0.3)',
        transform: 'translateX(-50%)',
        zIndex: 3
      }} />
    </div>
  )
}

export default BattleMeter