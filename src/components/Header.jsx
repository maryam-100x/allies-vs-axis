const Header = () => {
  return (
    <div style={{
      padding: '30px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 170, 255, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 50%, rgba(255, 0, 0, 0.15) 0%, transparent 40%)
        `,
        zIndex: -1
      }} />
      
      <span style={{
        fontSize: 'clamp(28px, 4vw, 48px)',
        fontWeight: '900',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        background: 'linear-gradient(to right, #00aaff, #ff3366, #ff0000)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 0 20px rgba(255,255,255,0.2)',
        position: 'relative',
        display: 'inline-block',
        padding: '0 20px'
      }}>
        <span style={{
          position: 'absolute',
          content: '""',
          left: 0,
          right: 0,
          bottom: '-5px',
          height: '3px',
          background: 'linear-gradient(to right, #00aaff, #ff0000)',
          borderRadius: '3px'
        }} />
        $ALLIES vs $AXIS
      </span>
      
      <div style={{
        fontSize: '16px',
        marginTop: '12px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '1px'
      }}>
        THE PVP WORLD WAR ON SOLANA
      </div>
    </div>
  )
}

export default Header