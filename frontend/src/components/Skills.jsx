import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const ACCENT = {
  ml:   '#e8a838',
  llm:  '#3dd6c8',
  web:  '#58a6ff',
  game: '#9d7fff',
}

// ─────────────────────────────────────────────────────────────
// ML — NEURAL NETWORK  (clicks → level 0-5, faster + rainbow)
// ─────────────────────────────────────────────────────────────
const ML_PALETTES = [
  ['#e8a838'],
  ['#e8a838', '#f0b84a'],
  ['#e8a838', '#3dd6c8'],
  ['#e8a838', '#3dd6c8', '#58a6ff'],
  ['#e8a838', '#3dd6c8', '#58a6ff', '#9d7fff'],
  ['#e8a838', '#3dd6c8', '#58a6ff', '#9d7fff', '#f472b6', '#fb923c'],
]

function NeuralNetCanvas({ clicks }) {
  const canvasRef = useRef(null)
  const clicksRef = useRef(clicks)
  useEffect(() => { clicksRef.current = clicks }, [clicks])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth || 380, H = 260
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const LAYERS = [3, 5, 4, 3]
    const xs = LAYERS.map((_, i) => W * 0.1 + (W * 0.8 / (LAYERS.length - 1)) * i)

    function nodeY(l, i) {
      const n = LAYERS[l]
      return H / 2 + (i - (n - 1) / 2) * (H / (n + 1))
    }

    let pulses = []
    let lastSpawn = 0
    let animId

    function frame(ts) {
      const level   = Math.min(clicksRef.current, 5)
      const palette = ML_PALETTES[level]
      const speed   = 0.012 + level * 0.009
      const interval = 360 - level * 52

      ctx.clearRect(0, 0, W, H)

      // connections — first pass: dim background connections
      const connAlpha = 50 + level * 18
      ctx.lineWidth = 0.7
      for (let l = 0; l < LAYERS.length - 1; l++) {
        for (let a = 0; a < LAYERS[l]; a++) {
          for (let b = 0; b < LAYERS[l + 1]; b++) {
            ctx.beginPath()
            ctx.strokeStyle = `${palette[0]}${connAlpha.toString(16).padStart(2,'0')}`
            ctx.moveTo(xs[l], nodeY(l, a))
            ctx.lineTo(xs[l + 1], nodeY(l + 1, b))
            ctx.stroke()
          }
        }
      }

      // second pass: draw active connections (ones a pulse is currently on) brighter
      pulses.forEach(p => {
        ctx.beginPath()
        ctx.strokeStyle = palette[0] + 'aa'
        ctx.lineWidth = 1.5
        ctx.moveTo(xs[p.fl], nodeY(p.fl, p.fn))
        ctx.lineTo(xs[p.fl + 1], nodeY(p.fl + 1, p.tn))
        ctx.stroke()
        ctx.lineWidth = 0.7
      })

      // update + draw pulses
      pulses = pulses.filter(p => {
        p.t += speed
        if (p.t > 1) return false
        const x = xs[p.fl] + (xs[p.fl + 1] - xs[p.fl]) * p.t
        const y = nodeY(p.fl, p.fn) + (nodeY(p.fl + 1, p.tn) - nodeY(p.fl, p.fn)) * p.t
        const r = 10 + level * 2
        const glowR = 22 + level * 3
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR)
        g.addColorStop(0, p.color)
        g.addColorStop(1, p.color + '00')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, glowR, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      // spawn
      if (ts - lastSpawn > interval) {
        const fl = Math.floor(Math.random() * (LAYERS.length - 1))
        pulses.push({
          fl, fn: Math.floor(Math.random() * LAYERS[fl]),
          tn: Math.floor(Math.random() * LAYERS[fl + 1]),
          t: 0,
          color: palette[Math.floor(Math.random() * palette.length)],
        })
        lastSpawn = ts
      }

      // nodes
      LAYERS.forEach((n, l) => {
        for (let i = 0; i < n; i++) {
          const x = xs[l], y = nodeY(l, i)
          const lit = pulses.some(p =>
            (p.fl === l - 1 && p.tn === i && p.t > 0.82) ||
            (p.fl === l && p.fn === i && p.t < 0.18)
          )
          const litPulse = pulses.find(p =>
            (p.fl === l - 1 && p.tn === i && p.t > 0.82) ||
            (p.fl === l && p.fn === i && p.t < 0.18)
          )
          const nodeColor = (lit && litPulse) ? litPulse.color : palette[0]
          if (lit) {
            const glowR = 22 + level * 3
            const ng = ctx.createRadialGradient(x, y, 0, x, y, glowR)
            ng.addColorStop(0, nodeColor + '66')
            ng.addColorStop(1, nodeColor + '00')
            ctx.fillStyle = ng
            ctx.beginPath()
            ctx.arc(x, y, glowR, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(x, y, lit ? 8 : 5, 0, Math.PI * 2)
          ctx.fillStyle = lit ? nodeColor : palette[0] + '55'
          ctx.fill()
        }
      })

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [])

  const level = Math.min(clicks, 5)
  const labels = ['IDLE', 'TRAINING', 'LEARNING', 'ADAPTING', 'OPTIMIZING', 'CONVERGED']

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} className="domain-canvas" width={380} height={260} />
      <span className="ml-level-badge" style={{ color: ML_PALETTES[level][0] }}>
        LVL {level} — {labels[level]}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DATA & APIs — LIVE MULTI-SOURCE DASHBOARD (clicks → cycle lens)
// ─────────────────────────────────────────────────────────────

const DATA_LENSES  = ['weather', 'stocks', 'cards', 'pokemon']
const DATA_META    = {
  weather: { title:'WEATHER',  source:'Open-Meteo'      },
  stocks:  { title:'MARKETS',  source:'S&P 500 TOP'     },
  cards:   { title:'HI-LO',    source:'deckofcardsapi'  },
  pokemon: { title:'POKÉMON',  source:'PokéAPI'         },
}
const WX_LABEL = {
  0:'CLEAR SKY', 1:'MAINLY CLEAR', 2:'PARTLY CLOUDY', 3:'OVERCAST',
  45:'FOG', 48:'FOG', 51:'DRIZZLE', 53:'DRIZZLE', 55:'DRIZZLE',
  61:'RAIN', 63:'RAIN', 65:'HEAVY RAIN', 71:'SNOW', 73:'SNOW', 75:'HEAVY SNOW',
  80:'SHOWERS', 81:'SHOWERS', 82:'HEAVY SHOWERS', 95:'THUNDERSTORM',
}
const STAT_COLS = { HP:'#ff6060', ATK:'#f08030', DEF:'#f8d030', 'SP.A':'#6890f0', 'SP.D':'#78c850', SPD:'#f85888' }
const SNAME_MAP = { hp:'HP', attack:'ATK', defense:'DEF', 'special-attack':'SP.A', 'special-defense':'SP.D', speed:'SPD' }
const TYPE_COLORS = {
  normal:'#a8a878', fire:'#f08030', water:'#6890f0', electric:'#f8d030',
  grass:'#78c850', ice:'#98d8d8', fighting:'#c03028', poison:'#a040a0',
  ground:'#e0c068', flying:'#a890f0', psychic:'#f85888', bug:'#a8b820',
  rock:'#b8a038', ghost:'#705898', dragon:'#7038f8', dark:'#705848',
  steel:'#b8b8d0', fairy:'#ee99ac',
}
const STOCKS_BASE  = [
  { sym:'NVDA', price:875,  cap:6 }, { sym:'AAPL', price:226, cap:5 },
  { sym:'MSFT', price:415,  cap:5 }, { sym:'GOOGL',price:175, cap:4 },
  { sym:'AMZN', price:187,  cap:4 }, { sym:'META', price:545, cap:3 },
  { sym:'TSLA', price:175,  cap:2 }, { sym:'NFLX', price:680, cap:2 },
]
const CARD_VAL = { ACE:1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, JACK:11, QUEEN:12, KING:13 }
const SUIT_SYM = { HEARTS:'♥', DIAMONDS:'♦', CLUBS:'♣', SPADES:'♠' }
const BJ_VAL   = { JACK:10, QUEEN:10, KING:10, ACE:11 }

const handValue = (cards) => {
  let v = 0, aces = 0
  for (const c of cards) {
    if (!c) continue
    const n = BJ_VAL[c.value] ?? (parseInt(c.value) || 0)
    if (c.value === 'ACE') aces++
    v += n
  }
  while (v > 21 && aces > 0) { v -= 10; aces-- }
  return v
}

function DataAPIShowcase({ clicks }) {
  const canvasRef = useRef(null)
  const lensIdx   = clicks % DATA_LENSES.length
  const lens      = DATA_LENSES[lensIdx]
  const C         = ACCENT.llm

  const [pokSearch, setPokSearch]   = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cardStatus, setCardStatus] = useState('init')
  const [gameMode,   setGameMode]   = useState('hilo')
  const [bjStatus,   setBjStatus]   = useState('idle')

  const wxRef        = useRef({ temp:null, feelsLike:null, code:0, wind:0, humidity:null, city:'', updatedAt:null, status:'pending' })
  const stocksRef    = useRef(STOCKS_BASE.map(s => ({ ...s, open:s.price, change:0, history:Array(30).fill(s.price) })))
  const pokemonRef   = useRef({ name:'', num:'', stats:[], sprite: null, moves: [] })
  const spriteImgRef = useRef({ url: null, img: null, loaded: false })
  const cardGameRef  = useRef({ deckId:null, current:null, previous:null, score:0, streak:0, status:'init', remaining:52 })
  const lastResultRef = useRef({ type:null, at:0 })
  const bjRef        = useRef({ deckId:null, dealerCards:[], playerCards:[], dealerHidden:true, phase:'idle', result:null, wins:0, losses:0, pushes:0, remaining:312 })
  const initDeckRef  = useRef(null)
  const gameModeRef  = useRef('hilo')
  const lensRef      = useRef(lens)
  const tickRef      = useRef(0)
  const geoFetchRef  = useRef(null)
  const fetchPokRef  = useRef(null)

  useEffect(() => { lensRef.current = lens }, [lens])
  useEffect(() => { gameModeRef.current = gameMode }, [gameMode])

  // ── Pokémon helpers ──
  const fetchPokemon = (query) => {
    pokemonRef.current = { name:'', num:'', stats:[], sprite: null, moves: [] }
    fetch(`https://pokeapi.co/api/v2/pokemon/${String(query).toLowerCase().trim()}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => {
        const getLvl = m => {
          const lvls = m.version_group_details
            .filter(v => v.move_learn_method.name === 'level-up')
            .map(v => v.level_learned_at)
          return lvls.length ? Math.max(...lvls) : 0
        }
        const lvlUpRaw = d.moves
          .filter(m => m.version_group_details.some(v => v.move_learn_method.name === 'level-up'))
          .sort((a, b) => getLvl(b) - getLvl(a))
          .slice(0, 4)
        const moveApiNames = (lvlUpRaw.length ? lvlUpRaw : d.moves.slice(0, 4))
          .map(m => m.move.name)
        // Set base data immediately (type defaults to 'normal' until fetched)
        pokemonRef.current = {
          name:   d.name,
          num:    '#' + String(d.id).padStart(3, '0'),
          stats:  d.stats.map(s => ({ name: SNAME_MAP[s.stat.name] ?? s.stat.name.slice(0,4).toUpperCase(), val: s.base_stat })),
          sprite: d.sprites?.front_default ?? null,
          moves:  moveApiNames.map(n => ({ name: n.replace(/-/g, ' ').toUpperCase(), type: 'normal' })),
        }
        // Fetch each move's type in parallel
        Promise.all(
          moveApiNames.map(n =>
            fetch(`https://pokeapi.co/api/v2/move/${n}`)
              .then(r => r.json())
              .then(md => ({ name: n.replace(/-/g, ' ').toUpperCase(), type: md.type?.name ?? 'normal' }))
              .catch(() => ({ name: n.replace(/-/g, ' ').toUpperCase(), type: 'normal' }))
          )
        ).then(movesWithTypes => {
          pokemonRef.current = { ...pokemonRef.current, moves: movesWithTypes }
        })
      })
      .catch(() => { pokemonRef.current = { name:'not found', num:'---', stats:[], moves: [] } })
  }
  fetchPokRef.current = fetchPokemon

  const refreshPokemon = (e) => {
    e?.stopPropagation()
    fetchPokemon(Math.floor(Math.random() * 898) + 1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!pokSearch.trim()) return
    fetchPokemon(pokSearch.trim())
    setShowSearch(false)
    setPokSearch('')
  }

  // ── Deck of Cards Hi-Lo game ──
  const initDeck = () => {
    cardGameRef.current = { deckId:null, current:null, previous:null, score:0, streak:0, status:'pending', remaining:52 }
    lastResultRef.current = { type:null, at:0 }
    setCardStatus('pending')
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(r => r.json())
      .then(d => {
        cardGameRef.current.deckId = d.deck_id
        return fetch(`https://deckofcardsapi.com/api/deck/${d.deck_id}/draw/?count=1`)
      })
      .then(r => r.json())
      .then(d => {
        cardGameRef.current.current = d.cards[0]
        cardGameRef.current.remaining = d.remaining
        cardGameRef.current.status = 'ready'
        setCardStatus('ready')
      })
      .catch(() => { cardGameRef.current.status = 'error'; setCardStatus('error') })
  }
  initDeckRef.current = initDeck

  const guessCard = (e, guess) => {
    e.stopPropagation()
    const cg = cardGameRef.current
    if (cg.status !== 'ready' || !cg.deckId) return
    cg.status = 'drawing'
    setCardStatus('drawing')
    fetch(`https://deckofcardsapi.com/api/deck/${cg.deckId}/draw/?count=1`)
      .then(r => r.json())
      .then(d => {
        const newCard = d.cards[0]
        const prevVal = CARD_VAL[cg.current.value] ?? 0
        const newVal  = CARD_VAL[newCard.value]  ?? 0
        const tied    = newVal === prevVal
        const correct = !tied && ((guess === 'higher' && newVal > prevVal) || (guess === 'lower' && newVal < prevVal))
        cg.previous  = cg.current
        cg.current   = newCard
        cg.remaining = d.remaining
        lastResultRef.current = { type: tied ? 'tie' : correct ? 'correct' : 'wrong', at: Date.now() }
        if (correct) { cg.score++; cg.streak++ }
        else if (!tied) { cg.streak = 0 }
        cg.status = d.remaining === 0 ? 'gameover' : 'ready'
        setCardStatus(cg.status)
      })
      .catch(() => { cg.status = 'error'; setCardStatus('error') })
  }

  // ── Blackjack ──
  const bjDeal = (keepDeck) => {
    const bj = bjRef.current
    const prevWins = bj.wins, prevLosses = bj.losses, prevPushes = bj.pushes
    bjRef.current = { ...bjRef.current, dealerCards:[], playerCards:[], dealerHidden:true, phase:'dealing', result:null, wins:prevWins, losses:prevLosses, pushes:prevPushes }
    setBjStatus('dealing')
    const CARD_DELAY = 420 // ms between each card
    const doFetch = (deckId) =>
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
        .then(r => r.json())
        .then(d => {
          // Deal order: player[0] → dealer[0] → player[1] → dealer[1] (face-down)
          const [c0, c1, c2, c3] = d.cards
          const bj2 = bjRef.current
          bj2.deckId = deckId
          bj2.remaining = d.remaining
          // Stagger reveals — canvas rAF picks up mutations automatically
          setTimeout(() => { bj2.playerCards = [c0] }, CARD_DELAY)
          setTimeout(() => { bj2.dealerCards = [c1] }, CARD_DELAY * 2)
          setTimeout(() => { bj2.playerCards = [c0, c2] }, CARD_DELAY * 3)
          setTimeout(() => {
            bj2.dealerCards = [c1, c3]
            bj2.dealerHidden = true
            const pVal = handValue(bj2.playerCards)
            if (pVal === 21) {
              bj2.dealerHidden = false
              if (handValue(bj2.dealerCards) === 21) { bj2.result = 'push'; bj2.pushes++ }
              else { bj2.result = 'blackjack'; bj2.wins++ }
              bj2.phase = 'result'
            } else {
              bj2.phase = 'player'
            }
            setBjStatus(bj2.phase)
          }, CARD_DELAY * 4)
        })
    if (keepDeck && bj.deckId) {
      const needShuffle = bj.remaining < 20
      const ready = needShuffle
        ? fetch(`https://deckofcardsapi.com/api/deck/${bj.deckId}/shuffle/`).then(() => doFetch(bj.deckId))
        : doFetch(bj.deckId)
      ready.catch(() => { bjRef.current.phase = 'error'; setBjStatus('error') })
    } else {
      fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
        .then(r => r.json())
        .then(d => doFetch(d.deck_id))
        .catch(() => { bjRef.current.phase = 'error'; setBjStatus('error') })
    }
  }

  const bjDoStand = () => {
    const bj = bjRef.current
    bj.dealerHidden = false
    const dealerPlay = () => {
      if (handValue(bj.dealerCards) >= 17) {
        const pVal = handValue(bj.playerCards)
        const dVal = handValue(bj.dealerCards)
        if (dVal > 21 || pVal > dVal) { bj.result = 'win'; bj.wins++ }
        else if (pVal < dVal) { bj.result = 'loss'; bj.losses++ }
        else { bj.result = 'push'; bj.pushes++ }
        bj.phase = 'result'
        setBjStatus('result')
        return
      }
      // Delay each dealer card draw so they appear one at a time
      setTimeout(() => {
        fetch(`https://deckofcardsapi.com/api/deck/${bj.deckId}/draw/?count=1`)
          .then(r => r.json())
          .then(d => { bj.dealerCards.push(d.cards[0]); bj.remaining = d.remaining; dealerPlay() })
          .catch(() => { bj.phase = 'error'; setBjStatus('error') })
      }, 600)
    }
    dealerPlay()
  }

  const bjHit = (e) => {
    e.stopPropagation()
    const bj = bjRef.current
    if (bj.phase !== 'player' || !bj.deckId) return
    bj.phase = 'dealing'
    setBjStatus('dealing')
    fetch(`https://deckofcardsapi.com/api/deck/${bj.deckId}/draw/?count=1`)
      .then(r => r.json())
      .then(d => {
        bj.playerCards.push(d.cards[0])
        bj.remaining = d.remaining
        const val = handValue(bj.playerCards)
        if (val > 21) { bj.dealerHidden = false; bj.result = 'bust'; bj.losses++; bj.phase = 'result'; setBjStatus('result') }
        else if (val === 21) { bj.phase = 'dealer'; setBjStatus('dealer'); bjDoStand() }
        else { bj.phase = 'player'; setBjStatus('player') }
      })
      .catch(() => { bj.phase = 'error'; setBjStatus('error') })
  }

  const bjStand = (e) => {
    e.stopPropagation()
    const bj = bjRef.current
    if (bj.phase !== 'player') return
    bj.phase = 'dealer'
    setBjStatus('dealer')
    bjDoStand()
  }

  // ── Weather ──
  const doGeoFetch = () => {
    wxRef.current = { ...wxRef.current, status: 'pending' }
    const doFetch = (lat, lon, city) =>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph`)
        .then(r => r.json())
        .then(d => {
          const cur = d.current
          wxRef.current = {
            temp:      Math.round(cur.temperature_2m),
            feelsLike: Math.round(cur.apparent_temperature),
            code:      cur.weather_code ?? 0,
            wind:      Math.round(cur.wind_speed_10m),
            humidity:  Math.round(cur.relative_humidity_2m ?? 0),
            city, updatedAt: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
            status: 'ok',
          }
        })
        .catch(() => { wxRef.current.status = 'error' })

    if (!navigator.geolocation) { doFetch(26.2034, -98.2300, 'McALLEN, TX'); return }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(r => r.json())
          .then(g => {
            const city = (g.address?.city || g.address?.town || g.address?.village || g.address?.county || 'YOUR LOCATION').toUpperCase()
            doFetch(lat, lon, city)
          })
          .catch(() => doFetch(lat, lon, 'YOUR LOCATION'))
      },
      () => { wxRef.current.status = 'denied'; doFetch(26.2034, -98.2300, 'McALLEN, TX') },
      { timeout: 8000 }
    )
  }
  geoFetchRef.current = doGeoFetch
  useEffect(() => { doGeoFetch() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stocks: simulated random walk every 1.5 s ──
  useEffect(() => {
    const id = setInterval(() => {
      stocksRef.current = stocksRef.current.map(s => {
        const delta   = s.price * (Math.random() - 0.497) * 0.004
        const price   = Math.max(1, s.price + delta)
        const change  = ((price - s.open) / s.open) * 100
        const history = [...s.history.slice(-29), price]
        return { ...s, price, change, history }
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  // ── Deck of Cards: init on mount ──
  useEffect(() => { initDeck() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pokémon: random on mount ──
  useEffect(() => {
    fetchPokemon(Math.floor(Math.random() * 898) + 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── rAF loop ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth || 380, H = 260
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    let animId

    const onCanvasClick = e => {
      if (lensRef.current === 'weather' && wxRef.current.status === 'denied') {
        e.stopPropagation(); geoFetchRef.current?.()
      } else if (lensRef.current === 'cards' && cardGameRef.current.status === 'gameover') {
        e.stopPropagation(); initDeckRef.current?.()
      }
    }
    canvas.addEventListener('click', onCanvasClick)

    const hdr = (title, source) => {
      const pulse = 3 + Math.sin(tickRef.current * 0.06) * 1.2
      ctx.font = 'bold 10px "Courier New"'; ctx.fillStyle = C; ctx.textAlign = 'left'
      ctx.fillText(title, 10, 16)
      const tw = ctx.measureText(title).width
      ctx.font = '8px "Courier New"'; ctx.fillStyle = C + '77'
      ctx.fillText('· ' + source, 10 + tw + 6, 16)
      ctx.fillStyle = '#4ade80'
      ctx.beginPath(); ctx.arc(W - 14, 11, pulse, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#4ade8033'
      ctx.beginPath(); ctx.arc(W - 14, 11, pulse + 5, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = C + '33'; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(8, 22); ctx.lineTo(W - 8, 22); ctx.stroke()
    }

    const frame = () => {
      tickRef.current++
      const t = tickRef.current
      ctx.clearRect(0, 0, W, H)
      const cur = lensRef.current

      // ── WEATHER ──
      if (cur === 'weather') {
        hdr('WEATHER', 'Open-Meteo')
        const wx = wxRef.current
        if (wx.status === 'pending') {
          const dots = '.'.repeat(Math.floor(t / 18) % 4)
          ctx.fillStyle = C + '88'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText('LOCATING' + dots, W / 2, 110)
          ctx.fillStyle = C + '44'; ctx.font = '8px "Courier New"'
          ctx.fillText('allow location for live weather', W / 2, 132)
        } else {
          // ── Animated weather icon (left column) ──
          const icx = 74, icy = 108
          const code = wx.code ?? 0
          if (code === 0) {
            // Clear: rotating sun
            const numR = 8, rLen = 11, sunR = 21
            ctx.strokeStyle = '#f8d030'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'
            for (let r = 0; r < numR; r++) {
              const ang = (r / numR) * Math.PI * 2 + t * 0.018
              ctx.beginPath()
              ctx.moveTo(icx + Math.cos(ang) * (sunR + 5), icy + Math.sin(ang) * (sunR + 5))
              ctx.lineTo(icx + Math.cos(ang) * (sunR + 5 + rLen), icy + Math.sin(ang) * (sunR + 5 + rLen))
              ctx.stroke()
            }
            const sg = ctx.createRadialGradient(icx, icy, 0, icx, icy, sunR + 18)
            sg.addColorStop(0, '#f8d030aa'); sg.addColorStop(1, '#f8d03000')
            ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(icx, icy, sunR + 18, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#f8d030'; ctx.beginPath(); ctx.arc(icx, icy, sunR, 0, Math.PI * 2); ctx.fill()
          } else if (code >= 1 && code <= 3) {
            // Partly cloudy
            const sh = Math.sin(t * 0.02) * 2
            ctx.fillStyle = '#f8d03077'; ctx.beginPath(); ctx.arc(icx - 10 + sh, icy - 10, 15, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#8899bb'
            ctx.beginPath(); ctx.arc(icx + 4, icy + 4, 16, 0, Math.PI * 2)
            ctx.arc(icx - 8, icy + 9, 12, 0, Math.PI * 2)
            ctx.arc(icx + 18, icy + 9, 11, 0, Math.PI * 2); ctx.fill()
          } else if (code >= 45 && code <= 48) {
            // Fog: drifting lines
            for (let li = 0; li < 5; li++) {
              const ly = icy - 20 + li * 10
              const ph = (t * 0.015 + li * 0.3) % 1
              ctx.strokeStyle = `rgba(180,200,220,${0.25 + 0.4 * Math.sin(ph * Math.PI)})`
              ctx.lineWidth = 3; ctx.lineCap = 'round'
              ctx.beginPath(); ctx.moveTo(icx - 34, ly); ctx.lineTo(icx + 34, ly); ctx.stroke()
            }
          } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
            // Rain
            ctx.fillStyle = '#5577aa'
            ctx.beginPath(); ctx.arc(icx, icy - 14, 17, 0, Math.PI * 2)
            ctx.arc(icx - 13, icy - 8, 12, 0, Math.PI * 2)
            ctx.arc(icx + 13, icy - 8, 12, 0, Math.PI * 2); ctx.fill()
            for (let d = 0; d < 6; d++) {
              const ph = ((t * 0.04 + d * 0.18) % 1)
              const dy = icy + 4 + ph * 30
              ctx.strokeStyle = `rgba(110,170,230,${1 - ph})`
              ctx.lineWidth = 1.5; ctx.lineCap = 'round'
              ctx.beginPath(); ctx.moveTo(icx - 20 + d * 8, dy); ctx.lineTo(icx - 22 + d * 8, dy + 8); ctx.stroke()
            }
          } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            // Snow
            ctx.fillStyle = '#8899aa'
            ctx.beginPath(); ctx.arc(icx, icy - 14, 17, 0, Math.PI * 2)
            ctx.arc(icx - 13, icy - 8, 12, 0, Math.PI * 2)
            ctx.arc(icx + 13, icy - 8, 12, 0, Math.PI * 2); ctx.fill()
            for (let s = 0; s < 5; s++) {
              const ph = ((t * 0.02 + s * 0.22) % 1)
              const sy2 = icy + 4 + ph * 28
              ctx.fillStyle = `rgba(210,230,255,${1 - ph * 0.5})`
              ctx.beginPath(); ctx.arc(icx - 18 + s * 9, sy2, 2.5, 0, Math.PI * 2); ctx.fill()
            }
          } else if (code >= 95) {
            // Thunderstorm
            ctx.fillStyle = '#334455'
            ctx.beginPath(); ctx.arc(icx, icy - 18, 19, 0, Math.PI * 2)
            ctx.arc(icx - 14, icy - 11, 14, 0, Math.PI * 2)
            ctx.arc(icx + 14, icy - 11, 14, 0, Math.PI * 2); ctx.fill()
            if (Math.floor(t / 25) % 3 !== 0) {
              ctx.fillStyle = '#f8d030dd'
              ctx.beginPath(); ctx.moveTo(icx + 2, icy - 4)
              ctx.lineTo(icx - 5, icy + 9); ctx.lineTo(icx + 1, icy + 9)
              ctx.lineTo(icx - 4, icy + 23); ctx.lineTo(icx + 9, icy + 7)
              ctx.lineTo(icx + 2, icy + 7); ctx.closePath(); ctx.fill()
            }
          } else {
            // Generic cloud
            ctx.fillStyle = '#7788aa'
            ctx.beginPath(); ctx.arc(icx, icy - 8, 17, 0, Math.PI * 2)
            ctx.arc(icx - 13, icy, 12, 0, Math.PI * 2)
            ctx.arc(icx + 13, icy, 12, 0, Math.PI * 2); ctx.fill()
          }

          // ── Right side: data ──
          const rx = 148
          ctx.fillStyle = C + 'bb'; ctx.font = '9px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText('\u{1F4CD} ' + (wx.city || '---'), rx, 38)

          ctx.globalAlpha = 0.94 + Math.sin(t * 0.02) * 0.06
          ctx.fillStyle = C; ctx.font = 'bold 50px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText((wx.temp ?? '--') + '°F', rx, 90)
          ctx.globalAlpha = 1

          ctx.fillStyle = C + 'aa'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText(WX_LABEL[wx.code] ?? 'UNKNOWN', rx, 110)

          // Divider
          ctx.strokeStyle = C + '22'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(8, 150); ctx.lineTo(W - 8, 150); ctx.stroke()

          // Stats row
          const wxStats = [
            { label: 'FEELS', val: (wx.feelsLike ?? '--') + '°F' },
            { label: 'WIND',  val: (wx.wind     ?? '--') + ' MPH' },
            { label: 'HUMID', val: (wx.humidity ?? '--') + '%' },
          ]
          const colW = (W - 16) / 3
          wxStats.forEach((s, i) => {
            const sx = 8 + i * colW
            ctx.fillStyle = C + '66'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'left'
            ctx.fillText(s.label, sx, 165)
            ctx.fillStyle = C + 'cc'; ctx.font = 'bold 11px "Courier New"'
            ctx.fillText(s.val, sx, 179)
          })

          // Temperature gradient bar
          const pct = Math.max(0, Math.min(1, ((wx.temp ?? 60) - 20) / 100))
          const bx = 8, bw = W - 16, by = 192, bh = 5
          ctx.fillStyle = C + '18'; ctx.fillRect(bx, by, bw, bh)
          const fw = pct * bw * (1 + Math.sin(t * 0.025) * 0.005)
          const gr = ctx.createLinearGradient(bx, by, bx + bw, by)
          gr.addColorStop(0, '#3dd6c8'); gr.addColorStop(0.5, '#f0b84a'); gr.addColorStop(1, '#fb923c')
          ctx.fillStyle = gr; ctx.fillRect(bx, by, fw, bh)

          if (wx.status === 'denied') {
            ctx.fillStyle = '#f87171cc'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('[ CLICK TO RETRY LOCATION ]', W / 2, 215)
          } else {
            ctx.fillStyle = C + '44'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('LIVE · ' + (wx.updatedAt ?? '--:--'), W / 2, 215)
          }
        }
      }

      // ── STOCKS treemap ──
      if (cur === 'stocks') {
        hdr('MARKETS', 'S&P 500 TOP')
        const stocks = stocksRef.current
        const pad = 3, cols = 4, rows = 2
        const sy   = 26
        const cw   = (W - pad * (cols + 1)) / cols
        const ch   = (H - sy - pad * (rows + 1)) / rows
        stocks.forEach((s, i) => {
          const col  = i % cols, row = Math.floor(i / cols)
          const x    = pad + col * (cw + pad)
          const y    = sy + pad + row * (ch + pad)
          const up   = s.change >= 0
          const inten = Math.min(Math.abs(s.change) / 3, 1)
          const bgA  = Math.round(0x14 + inten * 0x32).toString(16).padStart(2,'0')
          const hue  = up ? '#4ade80' : '#f87171'
          ctx.fillStyle = hue + bgA; ctx.fillRect(x, y, cw, ch)
          ctx.strokeStyle = hue + '77'; ctx.lineWidth = 1
          ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1)
          ctx.fillStyle = '#eeffff'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText(s.sym, x + cw / 2, y + ch * 0.40)
          const chStr = (up ? '▲' : '▼') + Math.abs(s.change).toFixed(2) + '%'
          ctx.fillStyle = hue; ctx.font = 'bold 12px "Courier New"'
          ctx.fillText(chStr, x + cw / 2, y + ch * 0.68)
          const pr = s.price >= 1000 ? '$' + s.price.toFixed(0) : '$' + s.price.toFixed(2)
          ctx.fillStyle = '#ffffffaa'; ctx.font = '10px "Courier New"'
          ctx.fillText(pr, x + cw / 2, y + ch * 0.92)
        })
      }

      // ── CARDS: HI-LO or BLACKJACK ──
      if (cur === 'cards') {
        const mode = gameModeRef.current

        // ── Shared small card draw helper (blackjack) ──
        const bjCard = (cx, cy, cw2, ch2, card, faceDown) => {
          if (faceDown) {
            ctx.fillStyle = '#1a2244'; ctx.fillRect(cx, cy, cw2, ch2)
            ctx.strokeStyle = C + '66'; ctx.lineWidth = 1; ctx.strokeRect(cx, cy, cw2, ch2)
            ctx.strokeStyle = C + '1e'; ctx.lineWidth = 0.5
            for (let px = cx + 5; px < cx + cw2 - 3; px += 5) {
              ctx.beginPath(); ctx.moveTo(px, cy + 2); ctx.lineTo(px, cy + ch2 - 2); ctx.stroke()
            }
            return
          }
          const isRed2 = card.suit === 'HEARTS' || card.suit === 'DIAMONDS'
          const sym2   = SUIT_SYM[card.suit] ?? '?'
          const vs2    = { JACK:'J', QUEEN:'Q', KING:'K', ACE:'A' }[card.value] ?? card.value
          const tc2    = isRed2 ? '#cc2200' : '#111133'
          ctx.shadowBlur = 8; ctx.shadowColor = C + '44'
          ctx.fillStyle = '#f0f0f5'; ctx.fillRect(cx, cy, cw2, ch2)
          ctx.shadowBlur = 0
          ctx.strokeStyle = C + 'aa'; ctx.lineWidth = 1; ctx.strokeRect(cx, cy, cw2, ch2)
          const fs2 = Math.round(cw2 * 0.24)
          ctx.fillStyle = tc2; ctx.font = `bold ${fs2}px "Courier New"`; ctx.textAlign = 'left'
          ctx.fillText(vs2, cx + 3, cy + fs2 + 2)
          ctx.font = `${Math.round(fs2 * 0.8)}px serif`; ctx.fillText(sym2, cx + 3, cy + fs2 * 2 + 1)
          ctx.font = `${Math.round(cw2 * 0.5)}px serif`; ctx.textAlign = 'center'
          ctx.fillText(sym2, cx + cw2 / 2, cy + ch2 * 0.65)
        }

        if (mode === 'blackjack') {
          hdr('BLACKJACK', 'deckofcardsapi')
          const bj = bjRef.current
          const cw2 = 48, ch2 = 68, gap = 5

          // Score row
          ;[
            { label:'WINS',   v: bj.wins,   col:'#4ade80' },
            { label:'PUSHES', v: bj.pushes, col: C        },
            { label:'LOSSES', v: bj.losses, col:'#f87171' },
          ].forEach((s, i) => {
            const sx = 8 + i * (W / 3)
            ctx.fillStyle = s.col + '77'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'left'
            ctx.fillText(s.label, sx, 35)
            ctx.fillStyle = s.col; ctx.font = 'bold 14px "Courier New"'
            ctx.fillText(String(s.v), sx, 51)
          })
          ctx.strokeStyle = C + '22'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(8, 59); ctx.lineTo(W - 8, 59); ctx.stroke()

          if (bj.phase === 'idle') {
            ctx.fillStyle = C + '44'; ctx.font = '9px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('PRESS DEAL TO START', W / 2, 145)
          } else if (bj.phase === 'dealing') {
            const dots = '.'.repeat(Math.floor(t / 18) % 4)
            ctx.fillStyle = C + '88'; ctx.font = '11px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('DEALING' + dots, W / 2, 145)
          } else if (bj.phase === 'error') {
            ctx.fillStyle = '#f87171'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('CONNECTION ERROR', W / 2, 145)
          } else {
            const dCards = bj.dealerCards, pCards = bj.playerCards
            const dVal = bj.dealerHidden ? handValue(dCards.slice(1)) : handValue(dCards)
            const pVal = handValue(pCards)

            // Dealer row
            const dLabel = bj.dealerHidden ? `DEALER: ${dVal} + ?` : `DEALER: ${handValue(dCards)}${handValue(dCards) > 21 ? ' BUST' : ''}`
            ctx.fillStyle = '#f87171bb'; ctx.font = 'bold 9px "Courier New"'; ctx.textAlign = 'left'
            ctx.fillText(dLabel, 8, 72)
            const dTotal = dCards.length
            const dStartX = (W - (dTotal * (cw2 + gap) - gap)) / 2
            dCards.forEach((card, i) => bjCard(dStartX + i * (cw2 + gap), 78, cw2, ch2, card, i === 0 && bj.dealerHidden))

            ctx.strokeStyle = C + '22'; ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(8, 154); ctx.lineTo(W - 8, 154); ctx.stroke()

            // Player row
            const bust = pVal > 21
            const blink2 = bust && Math.floor(t / 15) % 2 === 0
            ctx.fillStyle = blink2 ? '#f87171' : (pVal === 21 ? '#4ade80' : C + 'aa')
            ctx.font = 'bold 9px "Courier New"'; ctx.textAlign = 'left'
            ctx.fillText(`YOU: ${pVal}${bust ? ' — BUST' : pVal === 21 ? ' — 21!' : ''}`, 8, 168)
            const pTotal = pCards.length
            const pStartX = (W - (pTotal * (cw2 + gap) - gap)) / 2
            pCards.forEach((card, i) => bjCard(pStartX + i * (cw2 + gap), 174, cw2, ch2, card, false))

            // Result / prompt
            if (bj.phase === 'result') {
              const MSG = { win:'YOU WIN!', loss:'DEALER WINS', push:'PUSH', blackjack:'BLACKJACK!', bust:'BUST' }
              const COL = { win:'#4ade80', loss:'#f87171', push:C, blackjack:'#f8d030', bust:'#f87171' }
              ctx.globalAlpha = 0.85 + Math.sin(t * 0.09) * 0.15
              ctx.fillStyle = COL[bj.result] ?? C; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center'
              ctx.fillText(MSG[bj.result] ?? '', W / 2, 250)
              ctx.globalAlpha = 1
              ctx.fillStyle = C + '44'; ctx.font = '7px "Courier New"'
              ctx.fillText('DEAL AGAIN ↓', W / 2, 260)
            } else if (bj.phase === 'dealer') {
              const ddots = '.'.repeat(Math.floor(t / 20) % 4)
              ctx.fillStyle = C + '66'; ctx.font = '8px "Courier New"'; ctx.textAlign = 'center'
              ctx.fillText('DEALER DRAWING' + ddots, W / 2, 250)
            } else {
              ctx.fillStyle = C + '55'; ctx.font = '8px "Courier New"'; ctx.textAlign = 'center'
              ctx.fillText('HIT or STAND?', W / 2, 250)
            }
          }
        } else {
          hdr('HI-LO', 'deckofcardsapi')
        const cg = cardGameRef.current

        // Helper: draw a playing card
        const drawCard = (cx, cy, cw2, ch2, card, faded) => {
          const isRed = card.suit === 'HEARTS' || card.suit === 'DIAMONDS'
          const sym   = SUIT_SYM[card.suit] ?? '?'
          const valStr = { JACK:'J', QUEEN:'Q', KING:'K', ACE:'A' }[card.value] ?? card.value
          ctx.globalAlpha = faded ? 0.45 : 1
          ctx.fillStyle = faded ? '#1a1a2e' : '#f0f0f5'
          if (!faded) { ctx.shadowBlur = 14; ctx.shadowColor = C + '55' }
          ctx.fillRect(cx, cy, cw2, ch2)
          ctx.shadowBlur = 0
          ctx.strokeStyle = faded ? C + '44' : C + 'cc'
          ctx.lineWidth = faded ? 0.8 : 1.5
          ctx.strokeRect(cx, cy, cw2, ch2)
          if (!faded) {
            const tc = isRed ? '#cc2200' : '#111133'
            const fs  = Math.round(cw2 * 0.21)
            ctx.fillStyle = tc; ctx.font = `bold ${fs}px "Courier New"`; ctx.textAlign = 'left'
            ctx.fillText(valStr, cx + 4, cy + fs + 3)
            ctx.font = `${Math.round(fs * 0.82)}px serif`
            ctx.fillText(sym, cx + 4, cy + fs * 2 + 3)
            const bigFs = Math.round(cw2 * 0.52)
            ctx.font = `${bigFs}px serif`; ctx.textAlign = 'center'
            ctx.fillText(sym, cx + cw2 / 2, cy + ch2 * 0.62)
            ctx.font = `bold ${fs}px "Courier New"`; ctx.textAlign = 'right'
            ctx.fillText(valStr, cx + cw2 - 4, cy + ch2 - 10)
          } else {
            ctx.fillStyle = C + '33'; ctx.font = `bold ${Math.round(cw2 * 0.35)}px "Courier New"`; ctx.textAlign = 'center'
            ctx.fillText('?', cx + cw2 / 2, cy + ch2 * 0.6)
          }
          ctx.globalAlpha = 1
        }

        if (cg.status === 'pending' || cg.status === 'drawing') {
          const dots = '.'.repeat(Math.floor(t / 18) % 4)
          ctx.fillStyle = C + '88'; ctx.font = '11px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText((cg.status === 'pending' ? 'SHUFFLING' : 'DRAWING') + dots, W / 2, H / 2)
        } else if (cg.status === 'error') {
          ctx.fillStyle = '#f87171'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText('CONNECTION ERROR', W / 2, H / 2)
          ctx.fillStyle = C + '66'; ctx.font = '8px "Courier New"'
          ctx.fillText('[ CLICK TO RETRY ]', W / 2, H / 2 + 20)
        } else if (cg.status === 'gameover') {
          ctx.fillStyle = C; ctx.font = 'bold 16px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText('GAME OVER', W / 2, 105)
          ctx.fillStyle = C + 'aa'; ctx.font = '13px "Courier New"'
          ctx.fillText('FINAL SCORE: ' + cg.score, W / 2, 132)
          ctx.fillStyle = '#f8d030'; ctx.font = 'bold 11px "Courier New"'
          ctx.fillText('BEST STREAK: ' + cg.streak, W / 2, 154)
          ctx.fillStyle = C + '55'; ctx.font = '8px "Courier New"'
          ctx.fillText('[ CLICK OR USE BUTTON BELOW ]', W / 2, 180)
        } else {
          // Score row
          ctx.fillStyle = C + '77'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText('SCORE', 12, 36)
          ctx.fillStyle = C; ctx.font = 'bold 14px "Courier New"'
          ctx.fillText(String(cg.score), 12, 52)
          ctx.fillStyle = C + '77'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText('STREAK', W / 2, 36)
          ctx.fillStyle = '#f8d030'; ctx.font = 'bold 14px "Courier New"'
          ctx.fillText('×' + cg.streak, W / 2, 52)
          ctx.fillStyle = C + '77'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'right'
          ctx.fillText('LEFT', W - 12, 36)
          ctx.fillStyle = C + 'cc'; ctx.font = 'bold 14px "Courier New"'
          ctx.fillText(String(cg.remaining), W - 12, 52)

          ctx.strokeStyle = C + '22'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(8, 60); ctx.lineTo(W - 8, 60); ctx.stroke()

          // Previous card (small, faded) — left
          if (cg.previous) {
            drawCard(22, 75, 60, 84, cg.previous, true)
            ctx.fillStyle = C + '44'; ctx.font = '7px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText('PREV', 52, 170)
          } else {
            ctx.fillStyle = '#0d0d1a'; ctx.fillRect(22, 75, 60, 84)
            ctx.strokeStyle = C + '22'; ctx.lineWidth = 1; ctx.strokeRect(22, 75, 60, 84)
          }

          // Arrow
          const arrowY = 117
          ctx.strokeStyle = C + '55'; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.moveTo(92, arrowY); ctx.lineTo(112, arrowY)
          ctx.moveTo(107, arrowY - 5); ctx.lineTo(112, arrowY); ctx.lineTo(107, arrowY + 5)
          ctx.stroke()

          // Current card (large, bright) — right
          if (cg.current) drawCard(122, 65, 90, 124, cg.current, false)

          // Result flash
          const lr = lastResultRef.current
          const age = Date.now() - lr.at
          if (lr.type && age < 1100) {
            const alpha = Math.max(0, 1 - age / 1100)
            const col = lr.type === 'correct' ? '#4ade80' : lr.type === 'tie' ? '#f8d030' : '#f87171'
            const msg = lr.type === 'correct' ? '✓ CORRECT' : lr.type === 'tie' ? '~ TIE' : '✗ WRONG'
            ctx.globalAlpha = alpha
            ctx.fillStyle = col; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'center'
            ctx.fillText(msg, 232, 52)
            ctx.globalAlpha = 1
          }

          // Prompt
          ctx.fillStyle = C + '66'; ctx.font = '8px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText('IS THE NEXT CARD:', 8, 218)
          ctx.fillStyle = C + '44'; ctx.font = '7px "Courier New"'
          ctx.fillText('use buttons below ↓', 8, 231)
        }
        } // end else (hilo)
      }

      // ── POKÉMON ──
      if (cur === 'pokemon') {
        hdr('POKÉMON', 'PokéAPI')
        const { name, num, stats, sprite, moves } = pokemonRef.current

        // Load sprite image when URL changes
        if (sprite && spriteImgRef.current.url !== sprite) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          spriteImgRef.current = { url: sprite, img, loaded: false }
          img.onload = () => { spriteImgRef.current.loaded = true }
          img.src = sprite
        }

        if (!stats.length) {
          const dots = '.'.repeat(Math.floor(t / 18) % 4)
          ctx.fillStyle = C + '88'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText('LOADING' + dots, W / 2, H / 2)
        } else {
          const sprLoaded = spriteImgRef.current.loaded && spriteImgRef.current.url === sprite
          const sprSize   = 120
          const sprX      = W - sprSize - 6
          const sprY      = 26
          const barX      = 52
          const bmw       = sprLoaded ? sprX - barX - 16 : W - barX - 12

          // Stats — tall bars, big font
          const rowH = 21, barH = 17, sy3 = 28
          stats.forEach((s, i) => {
            const y   = sy3 + i * rowH
            const col = STAT_COLS[s.name] ?? C
            const bw  = (s.val / 255) * bmw * (1 + Math.sin(t * 0.02 + i * 1.1) * 0.008)
            ctx.fillStyle = '#0e0e2299'; ctx.fillRect(barX, y, bmw, barH)
            const g = ctx.createLinearGradient(barX, y, barX + bw, y)
            g.addColorStop(0, col + 'ee'); g.addColorStop(1, col + '55')
            ctx.fillStyle = g; ctx.fillRect(barX, y, bw, barH)
            ctx.fillStyle = col; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'right'
            ctx.fillText(s.name, barX - 5, y + 13)
            ctx.fillStyle = '#ddeeffcc'; ctx.font = '11px "Courier New"'; ctx.textAlign = 'right'
            ctx.fillText(String(s.val), sprX - 6, y + 13)
          })

          // Sprite — drawn after stats so it renders on top cleanly
          if (sprLoaded) {
            ctx.save()
            ctx.imageSmoothingEnabled = false
            ctx.strokeStyle = C + '44'; ctx.lineWidth = 1.5
            ctx.strokeRect(sprX - 1, sprY - 1, sprSize + 2, sprSize + 2)
            ctx.drawImage(spriteImgRef.current.img, sprX, sprY, sprSize, sprSize)
            ctx.restore()
          }

          // Name + number below sprite (no overlap)
          const sprCx = sprLoaded ? sprX + sprSize / 2 : W / 2
          const nameY = sprLoaded ? sprY + sprSize + 14 : sy3 + 6 * rowH + 16
          ctx.fillStyle = C; ctx.font = 'bold 10px "Courier New"'; ctx.textAlign = 'center'
          ctx.fillText(name.toUpperCase(), sprCx, nameY)
          ctx.fillStyle = C + '88'; ctx.font = '9px "Courier New"'
          ctx.fillText(num, sprCx, nameY + 13)

          // Divider
          const divY = nameY + 21
          ctx.strokeStyle = C + '33'; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(8, divY); ctx.lineTo(W - 8, divY); ctx.stroke()

          // ── Moves ──
          const mLabelY = divY + 13
          ctx.fillStyle = C + '88'; ctx.font = 'bold 9px "Courier New"'; ctx.textAlign = 'left'
          ctx.fillText('TOP MOVES', 10, mLabelY)

          const halfW  = (W - 24) / 2
          const badgeH = 22
          ;(moves ?? []).forEach((mv, i) => {
            const mx       = 10 + (i % 2) * (halfW + 4)
            const badgeY   = mLabelY + 6 + Math.floor(i / 2) * (badgeH + 5)
            const moveName = typeof mv === 'string' ? mv : mv.name
            const moveType = typeof mv === 'string' ? 'normal' : (mv.type ?? 'normal')
            const tc       = TYPE_COLORS[moveType] ?? C
            ctx.fillStyle = tc + '28'
            ctx.fillRect(mx, badgeY, halfW, badgeH)
            ctx.strokeStyle = tc + '88'; ctx.lineWidth = 0.8
            ctx.strokeRect(mx, badgeY, halfW, badgeH)
            ctx.font = '11px "Courier New"'
            let label = moveName
            const maxPx = halfW - 10
            while (ctx.measureText(label).width > maxPx && label.length > 2)
              label = label.slice(0, -1)
            if (label !== moveName) label = label.slice(0, -1) + '…'
            ctx.fillStyle = tc; ctx.textAlign = 'left'
            ctx.fillText(label, mx + 5, badgeY + 15)
          })
        }
      }

      animId = requestAnimationFrame(frame)
    }
    animId = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(animId); canvas.removeEventListener('click', onCanvasClick) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const btnSt = {
    background: C + '22',
    border: `2px solid ${C}`,
    color: C,
    fontFamily: '"Courier New", monospace',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 1.4,
    cursor: 'pointer',
    padding: '6px 16px',
    letterSpacing: '0.08em',
  }
  const btnStActive = {
    ...btnSt,
    background: C,
    color: '#0d1117',
  }

  const btnHi  = { ...btnSt, borderColor: '#4ade80', color: '#4ade80', background: '#4ade8015' }
  const btnLo  = { ...btnSt, borderColor: '#f87171', color: '#f87171', background: '#f8717115' }
  const canGuess = cardStatus === 'ready'

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} className="domain-canvas" width={380} height={260} />

      {lens === 'cards' && (
        <div
          style={{ borderTop: `1px solid ${C}33`, background: '#07090f' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Mode tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${C}22` }}>
            {['hilo','blackjack'].map(m => (
              <button
                key={m}
                onClick={e => { e.stopPropagation(); setGameMode(m) }}
                style={{
                  flex:1, background: gameMode === m ? C + '18' : 'transparent',
                  border:'none', borderBottom: gameMode === m ? `2px solid ${C}` : '2px solid transparent',
                  color: gameMode === m ? C : C + '55',
                  fontFamily:'"Courier New"', fontSize:9, fontWeight:'bold',
                  letterSpacing:'0.12em', cursor:'pointer', padding:'5px 0',
                  textTransform:'uppercase',
                }}
              >{m === 'hilo' ? 'HI-LO' : 'BLACKJACK'}</button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8, alignItems:'center', padding:'7px 10px', flexWrap:'wrap' }}>
            {gameMode === 'hilo' ? (
              cardStatus === 'gameover' ? (
                <button onClick={e => { e.stopPropagation(); initDeck() }} style={btnSt}>↻ PLAY AGAIN</button>
              ) : (
                <>
                  <button onClick={e => guessCard(e, 'higher')} disabled={!canGuess} style={{ ...btnHi, opacity: canGuess ? 1 : 0.4 }}>▲ HIGHER</button>
                  <button onClick={e => guessCard(e, 'lower')}  disabled={!canGuess} style={{ ...btnLo, opacity: canGuess ? 1 : 0.4 }}>▼ LOWER</button>
                  <span style={{ fontFamily:'"Courier New"', fontSize:9, color: C + '44', marginLeft:'auto', letterSpacing:'0.08em' }}>GUESS THE NEXT CARD</span>
                </>
              )
            ) : (
              bjStatus === 'result' || bjStatus === 'idle' || bjStatus === 'error' ? (
                <button onClick={e => { e.stopPropagation(); bjDeal(bjStatus === 'result') }} style={btnSt}>
                  {bjStatus === 'idle' ? '▶ DEAL' : '↻ DEAL AGAIN'}
                </button>
              ) : (
                <>
                  <button onClick={bjHit}   disabled={bjStatus !== 'player'} style={{ ...btnHi, opacity: bjStatus === 'player' ? 1 : 0.4 }}>+ HIT</button>
                  <button onClick={bjStand} disabled={bjStatus !== 'player'} style={{ ...btnSt, opacity: bjStatus === 'player' ? 1 : 0.4 }}>■ STAND</button>
                  {bjStatus === 'dealer' && (
                    <span style={{ fontFamily:'"Courier New"', fontSize:9, color:'#f8d030', letterSpacing:'0.08em' }}>DEALER PLAYING…</span>
                  )}
                </>
              )
            )}
          </div>
        </div>
      )}

      {lens === 'pokemon' && (
        <div
          style={{
            display: 'flex', gap: 8, alignItems: 'center',
            padding: '8px 10px', borderTop: `1px solid ${C}33`,
            background: '#07090f', flexWrap: 'wrap',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={refreshPokemon} style={btnSt} title="Random Pokémon">↻ RANDOM</button>
          <button onClick={() => setShowSearch(s => !s)} style={showSearch ? btnStActive : btnSt} title="Search Pokémon">⌕ SEARCH</button>
          {showSearch && (
            <form onSubmit={handleSearch} style={{ display:'flex', gap:6, alignItems:'center' }}>
              <input
                value={pokSearch}
                onChange={e => setPokSearch(e.target.value)}
                placeholder="name or #"
                autoFocus
                style={{
                  background:'#0d1117', border:`2px solid ${C}`, color:C,
                  font:'10px "Courier New"', padding:'5px 10px', width:100, outline:'none',
                }}
              />
              <button type="submit" style={btnSt}>GO</button>
              <button type="button" onClick={() => { setShowSearch(false); setPokSearch('') }} style={btnSt}>✕</button>
            </form>
          )}
        </div>
      )}

      <span className="ml-level-badge" style={{ color: C }}>
        {lensIdx + 1}/{DATA_LENSES.length} — {DATA_META[lens].title}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// WEB — CODE INSPECTOR  (clicks → cycle stack panels)
// ─────────────────────────────────────────────────────────────

const TOKEN = {
  kw:   '#c792ea',
  fn:   '#82aaff',
  str:  '#c3e88d',
  cm:   '#546e7a',
  num:  '#f78c6c',
  id:   '#eeffff',
  tag:  '#f07178',
  attr: '#ffcb6b',
  pl:   '#a9b7c6',
}

const WEB_PANELS = [
  {
    id: 'react', label: 'REACT', file: 'Projects.jsx', color: '#61dafb', badge: 'FRONTEND',
    lines: [
      [['kw','const '],['id','Projects'],['pl',' = () => {']],
      [['pl','  '],['kw','const '],['pl','[data, setData] = '],['fn','useState'],['pl','([])']],
      [['pl','  '],['fn','useEffect'],['pl','(() => {']],
      [['pl','    '],['fn','fetch'],['pl','('],['str',"'/api/projects'"],['pl',')']],
      [['pl','      .'],['fn','then'],['pl','(r => r.'],['fn','json'],['pl','()).'],['fn','then'],['pl','(setData)']],
      [['pl','  }, [])']],
      [['pl','  '],['kw','return '],['tag','<ProjectGrid '],['attr','items'],['pl','={data} />']],
      [['pl','}']],
    ],
  },
  {
    id: 'express', label: 'EXPRESS', file: 'routes/api.js', color: '#68d391', badge: 'BACKEND',
    lines: [
      [['id','router'],['pl','.'],['fn','get'],['pl','('],['str',"'/api/projects'"],['pl',', '],['kw','async '],['pl','(req, res) => {']],
      [['pl','  '],['kw','const '],['pl','{ page = '],['num','1'],['pl',', limit = '],['num','9'],['pl',' } = req.query']],
      [['pl','  '],['kw','const '],['id','docs'],['pl',' = '],['kw','await '],['id','Project']],
      [['pl','    .'],['fn','find'],['pl','({ featured: '],['kw','true'],['pl',' })']],
      [['pl','    .'],['fn','skip'],['pl','((page − '],['num','1'],['pl',') * limit).'],['fn','limit'],['pl','(+limit)']],
      [['pl','  '],['id','res'],['pl','.'],['fn','json'],['pl','({ ok: '],['kw','true'],['pl',', data: '],['id','docs'],['pl',' })']],
      [['pl','})']],
    ],
  },
  {
    id: 'mongo', label: 'MONGODB', file: 'models/Project.js', color: '#4db33d', badge: 'DATABASE',
    lines: [
      [['kw','const '],['id','ProjectSchema'],['pl',' = '],['kw','new '],['fn','Schema'],['pl','({']],
      [['pl','  title:    { type: '],['id','String'],['pl',', required: '],['kw','true'],['pl',' },']],
      [['pl','  stack:    ['],['id','String'],['pl','],']],
      [['pl','  featured: '],['id','Boolean'],['pl',',']],
      [['pl','  liveUrl:  '],['id','String'],['pl',',']],
      [['pl','  date:     { type: '],['id','Date'],['pl',', default: '],['id','Date.now'],['pl',' }']],
      [['pl','})']],
    ],
  },
  {
    id: 'socket', label: 'SOCKET.IO', file: 'socket/events.js', color: '#9d7fff', badge: 'REALTIME',
    lines: [
      [['id','io'],['pl','.'],['fn','on'],['pl','('],['str',"'connection'"],['pl',', socket => {']],
      [['pl','  socket.'],['fn','on'],['pl','('],['str',"'join-room'"],['pl',', roomId => {']],
      [['pl','    socket.'],['fn','join'],['pl','(roomId)']],
      [['pl','    io.'],['fn','to'],['pl','(roomId).'],['fn','emit'],['pl','('],['str',"'user-joined'"],['pl',',']],
      [['pl','      { id: socket.id, ts: '],['fn','Date.now'],['pl','() })']],
      [['pl','  })']],
      [['pl','})']],
    ],
  },
]

function WebCodeInspector({ clicks }) {
  const idx   = clicks % WEB_PANELS.length
  const panel = WEB_PANELS[idx]

  return (
    <div className="wci" style={{ '--wci-c': panel.color }}>

      <div className="wci-tabs">
        {WEB_PANELS.map((p, i) => (
          <span
            key={p.id}
            className={'wci-tab' + (i === idx ? ' wci-tab--on' : '')}
            style={{ '--tc': p.color }}
          >
            {p.label}
          </span>
        ))}
        <span className="wci-tab-gap" />
        <span className="wci-badge" style={{ color: panel.color }}>{panel.badge}</span>
      </div>

      <div key={clicks} className="wci-code">
        <div className="wci-gutter">
          {panel.lines.map((_, i) => <span key={i} className="wci-ln">{i + 1}</span>)}
        </div>
        <div className="wci-body">
          {panel.lines.map((tokens, li) => (
            <div
              key={li}
              className="wci-line"
              style={{ animationDelay: `${li * 0.048}s` }}
            >
              {tokens.map(([type, text], ti) => (
                <span key={ti} style={{ color: TOKEN[type] || '#eeffff' }}>{text}</span>
              ))}
              {li === panel.lines.length - 1 && <span className="wci-cursor" />}
            </div>
          ))}
        </div>
      </div>

      <div className="wci-status">
        <span className="wci-file" style={{ color: panel.color + 'bb' }}>{panel.file}</span>
        <div className="wci-pips">
          {WEB_PANELS.map((_, i) => (
            <span key={i} className="wci-pip" style={{ background: i === idx ? panel.color : '#1e2030' }} />
          ))}
        </div>
        <span className="wci-hint" style={{ color: panel.color + '66' }}>click to cycle</span>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// GAME — PIXEL BATTLE  (clicks → cycle attack modes)
// ─────────────────────────────────────────────────────────────
const PS = 5

const KP = ['', '#8a9baa', '#c5d5de', '#1a2838', '#e8a838', '#4a6070', '#7ab8ff', '#0f1820']
// 1=steel, 2=polished silver, 3=dark visor, 4=gold, 5=shadow steel, 6=glowing blue slit, 7=dark boot
const KNIGHT_IDLE = [
  [0,0,1,4,4,1,0,0],  // helmet top — gold crest
  [0,1,2,4,4,2,1,0],  // upper helmet, gold band
  [0,1,2,3,3,2,1,0],  // visor top (dark)
  [0,1,5,6,6,5,1,0],  // glowing blue eye slit
  [0,1,2,3,3,2,1,0],  // lower visor / chin
  [0,0,1,2,2,1,0,0],  // gorget (neck guard)
  [1,2,1,1,1,1,2,0],  // pauldrons (shoulder plates)
  [1,4,3,1,1,3,4,0],  // breastplate, gold trim
  [1,4,3,1,1,3,4,0],  // lower chest
  [0,1,1,5,5,1,1,0],  // tassets (hip guards)
  [0,1,2,0,0,2,1,0],  // thighs
  [0,1,2,0,0,2,1,0],  // greaves (shin guards)
  [0,7,2,0,0,2,7,0],  // sabatons (foot armor)
  [0,7,7,0,0,7,7,0],  // boot soles
]
const KNIGHT_ATK = [
  [0,0,1,4,4,1,0,0],
  [0,1,2,4,4,2,1,0],
  [0,1,2,3,3,2,1,0],
  [0,1,5,6,6,5,1,0],
  [0,1,2,3,3,2,1,0],
  [0,0,1,2,2,1,0,0],
  [1,2,1,1,1,1,6,6],  // gauntlet extended right
  [1,4,3,1,1,3,6,6],  // sword arm
  [1,4,3,1,1,3,4,0],
  [0,1,1,5,5,1,1,0],
  [0,0,1,2,0,2,1,0],  // combat lean
  [0,0,1,2,0,2,1,0],
  [0,0,7,2,0,2,7,0],
  [0,0,7,7,0,7,7,0],
]

const GP = ['', '#5aae2a', '#2d7010', '#ff2222', '#8b5a1a', '#f0e060', '#1a4408']
const GOBLIN_IDLE = [
  [0,2,2,2,2,0],
  [2,1,1,1,1,2],
  [2,3,1,3,1,2],
  [2,1,5,5,1,2],
  [0,2,2,2,2,0],
  [2,2,2,2,2,2],
  [1,2,1,1,2,1],
  [0,2,2,2,2,0],
  [4,4,0,2,0,0],
  [4,0,0,2,0,0],
  [0,0,2,0,2,0],
  [0,2,2,0,2,2],
]
const GOBLIN_HIT = [
  [2,2,2,2,0,0],
  [1,1,1,1,2,0],
  [3,1,3,1,2,0],
  [1,5,5,1,2,0],
  [2,2,2,2,0,0],
  [0,2,2,2,2,2],
  [0,2,1,1,2,1],
  [0,0,2,2,2,0],
  [0,0,0,4,4,0],
  [0,0,0,2,0,0],
  [0,0,2,0,2,0],
  [0,0,2,2,2,0],
]

function drawSprite(ctx, sprite, palette, ox, oy, flipX) {
  const cols = sprite[0].length
  sprite.forEach((row, y) => {
    row.forEach((ci, x) => {
      if (!ci) return
      ctx.fillStyle = palette[ci]
      const dx = flipX ? ox + (cols - 1 - x) * PS : ox + x * PS
      ctx.fillRect(dx, oy + y * PS, PS, PS)
    })
  })
}

const SUBCOMMANDS = [
  ['SWORD', 'AXE', 'BOW'],
  ['FIREBALL', 'ARCANE', 'ICE'],
  ['SM.POT', 'POTION', 'FOOD'],
  null,
]
const SUB_DMG  = [[18, 26, 12], [22, 32, 15], [0, 0, 0], [0]]
const SUB_HEAL = [12, 25, 8]
const SUB_DUR  = [[45, 50, 32], [35, 35, 35], [40, 40, 30], [40]]

function PixelBattleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth || 380, H = 260
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    const C = ACCENT.game

    const GROUND = 140
    const CMD_Y  = 150
    const KX = 20
    const GX = W - GOBLIN_IDLE[0].length * PS - 20
    const KH = KNIGHT_IDLE.length * PS
    const GH = GOBLIN_IDLE.length * PS
    const COMMANDS = ['ATTACK', 'MAGIC', 'ITEM', 'RUN']
    const ENEMY_DUR = 30

    const s = {
      phase: 'idle',
      selectedMain: 0,
      selectedSub: 0,
      hoverMain: -1,
      hoverSub: -1,
      kHp: 100,
      gHp: 100,
      floats: [],
      shakeFrames: 0,
      gFlash: { color: '', life: 0 },
      kFlash: 0,
      blinkFrame: 0,
      tick: 0,
      firstClick: false,
      lightningPts: null,
      lightningLife: 0,
      lightningColor: '#c8b0ff',
    }

    // ── Canvas interaction (hover + zone-click) ──
    const ROW1_Y = CMD_Y + 2
    const ROW1_H = 26
    const ROW2_Y = ROW1_Y + ROW1_H
    const ROW2_H = 28

    canvas.addEventListener('mousemove', e => {
      if (s.phase !== 'idle') return
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * (W / r.width)
      const y = (e.clientY - r.top)  * (H / r.height)
      if (y >= ROW1_Y && y < ROW1_Y + ROW1_H) {
        s.hoverMain = Math.min(Math.floor(x / (W / 4)), 3)
        s.hoverSub  = -1
      } else if (y >= ROW2_Y && y < ROW2_Y + ROW2_H && s.hoverMain >= 0 && s.hoverMain !== 3) {
        const subs = SUBCOMMANDS[s.hoverMain]
        s.hoverSub = Math.min(Math.floor(x / (W / subs.length)), subs.length - 1)
      } else {
        s.hoverSub = -1
      }
    })
    canvas.addEventListener('mouseleave', () => { s.hoverMain = -1; s.hoverSub = -1 })
    canvas.addEventListener('click', e => {
      e.stopPropagation()
      if (s.phase !== 'idle') return
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * (W / r.width)
      const y = (e.clientY - r.top)  * (H / r.height)
      s.firstClick = true
      if (y >= ROW1_Y && y < ROW1_Y + ROW1_H) {
        const idx = Math.min(Math.floor(x / (W / 4)), 3)
        s.hoverMain = idx
        if (idx === 3) {
          s.selectedMain = 3; s.selectedSub = 0
          s.phase = 'player'; s.tick = 0
          s.lightningPts = null; s.lightningLife = 0
        }
      } else if (y >= ROW2_Y && y < ROW2_Y + ROW2_H && s.hoverMain >= 0 && s.hoverMain !== 3) {
        const subs = SUBCOMMANDS[s.hoverMain]
        const subIdx = Math.min(Math.floor(x / (W / subs.length)), subs.length - 1)
        s.selectedMain = s.hoverMain
        s.selectedSub  = subIdx
        s.phase = 'player'; s.tick = 0
        s.lightningPts = null; s.lightningLife = 0
      }
    })

    function addFloat(x, y, text, color) {
      s.floats.push({ x, y, text, color, life: 1.0 })
    }

    function buildLightning(x1, y1, x2, y2) {
      const pts = [{ x: x1, y: y1 }]
      for (let i = 1; i < 7; i++) {
        const t = i / 7
        pts.push({
          x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 28,
          y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 18,
        })
      }
      pts.push({ x: x2, y: y2 })
      return pts
    }

    function drawHpBar(label, hp, x, y, col) {
      const crit = hp < 25
      ctx.fillStyle = '#1e2030'
      ctx.fillRect(x, y, 56, 6)
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.fillRect(x, y, Math.round(56 * hp / 100), 6)
      if (crit && s.blinkFrame % 20 < 10) {
        ctx.fillStyle = 'rgba(255,60,60,0.3)'
        ctx.fillRect(x, y, Math.round(56 * hp / 100), 6)
      }
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.font = 'bold 8px "Courier New"'
      ctx.textAlign = 'left'
      ctx.fillText(label, x, y - 2)
    }

    function drawCommandBox() {
      ctx.fillStyle = '#0c0e18'
      ctx.fillRect(0, CMD_Y, W, H - CMD_Y)
      ctx.strokeStyle = C + 'cc'
      ctx.lineWidth = 1
      ctx.strokeRect(1, CMD_Y, W - 2, H - CMD_Y - 1)

      if (s.phase === 'idle') {
        // ── Row 1: main commands ──
        const slotW = W / 4
        const row1TextY = ROW1_Y + 17
        COMMANDS.forEach((cmd, i) => {
          const cx = slotW * i + slotW / 2
          const hot = i === s.hoverMain
          if (hot) {
            ctx.fillStyle = C + '28'
            ctx.fillRect(slotW * i + 1, ROW1_Y, slotW - 2, ROW1_H - 1)
          }
          ctx.fillStyle = hot ? C : C + 'aa'
          ctx.font = hot ? 'bold 10px "Courier New"' : '9px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText(hot ? '▶ ' + cmd : cmd, cx, row1TextY)
        })

        // ── Divider ──
        ctx.strokeStyle = C + '55'
        ctx.lineWidth = 0.5
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(4, ROW2_Y); ctx.lineTo(W - 4, ROW2_Y)
        ctx.stroke(); ctx.setLineDash([])

        // ── Row 2: sub-options or hint ──
        const row2TextY = ROW2_Y + 18
        if (s.hoverMain >= 0 && s.hoverMain !== 3) {
          const subs = SUBCOMMANDS[s.hoverMain]
          const subSlotW = W / subs.length
          subs.forEach((sub, i) => {
            const cx = subSlotW * i + subSlotW / 2
            const hot = i === s.hoverSub
            if (hot) {
              ctx.fillStyle = C + '30'
              ctx.fillRect(subSlotW * i + 1, ROW2_Y, subSlotW - 2, ROW2_H - 1)
            }
            ctx.fillStyle = hot ? C : C + 'cc'
            ctx.font = hot ? 'bold 9px "Courier New"' : '8px "Courier New"'
            ctx.textAlign = 'center'
            ctx.fillText(hot ? '▶ ' + sub : sub, cx, row2TextY)
          })
        } else if (s.hoverMain === 3) {
          ctx.fillStyle = C + 'cc'
          ctx.font = '8px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText('[ CLICK TO ATTEMPT ESCAPE ]', W / 2, row2TextY)
        } else if (!s.firstClick) {
          ctx.fillStyle = C + '99'
          ctx.font = '8px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText('hover a command to choose', W / 2, row2TextY)
        }
        return
      }

      // ── Active action phases ──
      const mid = CMD_Y + (H - CMD_Y) / 2 + 5
      if (s.phase === 'player' && s.selectedMain === 3 && s.tick > 10) {
        ctx.fillStyle = C
        ctx.font = 'bold 11px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText('…but failed to escape!', W / 2, mid)
        return
      }
      const subs = SUBCOMMANDS[s.selectedMain]
      const actionName = subs ? subs[s.selectedSub] : 'RUN'
      ctx.fillStyle = s.phase === 'enemy' ? '#ff7777' : C
      ctx.font = 'bold 10px "Courier New"'
      ctx.textAlign = 'center'
      ctx.fillText(s.phase === 'enemy' ? '⚔ ENEMY COUNTER!' : '▶ ' + actionName, W / 2, mid)
    }

    let animId

    function frame() {

      // ── Screen shake transform ──
      ctx.save()
      if (s.shakeFrames > 0) {
        ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
        s.shakeFrames--
      }

      ctx.clearRect(-5, -5, W + 10, H + 10)

      // scanlines (battle area only)
      for (let sy = 0; sy < GROUND; sy += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, sy, W, 1)
      }

      // ground line
      ctx.strokeStyle = C + '80'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(10, GROUND)
      ctx.lineTo(W - 10, GROUND)
      ctx.stroke()

      // ── Idle bob ──
      s.blinkFrame++
      const bobY = s.phase === 'idle'
        ? Math.round(Math.sin(s.blinkFrame / 60 * Math.PI * 2))
        : 0

      // ── Sprite selection ──
      const useKAtk = s.phase === 'player' && s.selectedMain === 0
        && s.selectedSub !== 2 && s.tick > 5 && s.tick < 42
      const kSprite = useKAtk ? KNIGHT_ATK : KNIGHT_IDLE
      const gSprite = s.gFlash.life > 0.5 ? GOBLIN_HIT : GOBLIN_IDLE

      // ── Sprite positional offsets ──
      let kOffsetX = 0, gOffsetX = 0
      if (s.phase === 'player' && s.selectedMain === 3) {
        kOffsetX = Math.min(s.tick * 2, 40)
      }
      if (s.phase === 'enemy') {
        gOffsetX = s.tick < 15 ? -s.tick * 1.2 : -(30 - s.tick) * 1.2
      }

      // ── Draw sprites ──
      drawSprite(ctx, kSprite, KP, KX + kOffsetX, GROUND - KH + bobY, false)
      drawSprite(ctx, gSprite, GP, GX + gOffsetX, GROUND - GH + bobY, true)

      // ── ATTACK sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 0) {
        const handX = KX + KNIGHT_IDLE[0].length * PS + 2
        const handY = GROUND - KH * 0.58

        if (s.selectedSub === 0) {
          const angle = -Math.PI * 0.56 + (Math.PI * 0.64) * Math.min(s.tick / 35, 1)
          const ex = handX + Math.cos(angle) * 32
          const ey = handY + Math.sin(angle) * 32
          ctx.save()
          ctx.lineCap = 'round'
          ctx.strokeStyle = '#aaccff'; ctx.lineWidth = 7; ctx.globalAlpha = 0.3
          ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(ex, ey); ctx.stroke()
          ctx.strokeStyle = '#e8f4ff'; ctx.lineWidth = 2.5; ctx.globalAlpha = 1
          ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(ex, ey); ctx.stroke()
          ctx.fillStyle = '#fff'
          ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fill()
          ctx.restore()
          if (s.tick === 25) {
            const dmg = SUB_DMG[0][0]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `SLASH! -${dmg}`, '#ff6666')
            s.gFlash = { color: 'rgba(255,120,40,', life: 1.4 }
            s.shakeFrames = 8
          }
        }

        if (s.selectedSub === 1) {
          // Axe swings from raised (overhead) down through the goblin
          const swing = Math.min(s.tick / 45, 1)
          const axeAngle = -Math.PI * 0.9 + Math.PI * 1.1 * swing
          const pivotX = handX
          const pivotY = handY
          const shaftLen = 28

          ctx.save()
          ctx.translate(pivotX, pivotY)
          ctx.rotate(axeAngle)

          // handle
          ctx.strokeStyle = '#8B5E3C'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, shaftLen); ctx.stroke()

          // blade — crescent shape at tip of shaft
          const bx = 0, by = shaftLen
          // blade body (wide flat shape)
          ctx.fillStyle = '#d4d4d4'
          ctx.beginPath()
          ctx.moveTo(bx,      by - 3)   // base top-right
          ctx.lineTo(bx + 12, by - 10)  // top-right point
          ctx.lineTo(bx + 14, by + 2)   // bottom-right bulge
          ctx.lineTo(bx + 8,  by + 7)   // bottom-right curve
          ctx.lineTo(bx,      by + 4)   // base bottom
          ctx.closePath()
          ctx.fill()
          // blade edge highlight
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(bx + 12, by - 10)
          ctx.lineTo(bx + 14, by + 2)
          ctx.lineTo(bx + 8,  by + 7)
          ctx.stroke()
          // blade shadow/dark side
          ctx.fillStyle = '#888'
          ctx.beginPath()
          ctx.moveTo(bx,      by - 3)
          ctx.lineTo(bx - 6,  by - 8)
          ctx.lineTo(bx - 5,  by + 5)
          ctx.lineTo(bx,      by + 4)
          ctx.closePath()
          ctx.fill()
          // butt cap
          ctx.fillStyle = '#6b4226'
          ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill()

          // motion blur trail at fast swing speeds
          if (swing > 0.1 && swing < 0.85) {
            ctx.globalAlpha = 0.18
            ctx.strokeStyle = '#ffcc66'
            ctx.lineWidth = 10
            ctx.beginPath()
            ctx.moveTo(0, shaftLen * 0.5)
            ctx.lineTo(0, shaftLen + 8)
            ctx.stroke()
          }

          ctx.restore()

          if (s.tick === 35) {
            const dmg = SUB_DMG[0][1]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `CLEAVE! -${dmg}`, '#ffcc44')
            s.gFlash = { color: 'rgba(255,180,50,', life: 1.8 }
            s.shakeFrames = 12
          }
        }

        if (s.selectedSub === 2) {
          const HIT_T = 20
          if (s.tick <= HIT_T) {
            const p = s.tick / HIT_T
            const ax = (KX + KNIGHT_IDLE[0].length * PS + 4) + (GX - 4 - (KX + KNIGHT_IDLE[0].length * PS + 4)) * p
            const ay = (GROUND - KH * 0.52) + ((GROUND - GH * 0.52) - (GROUND - KH * 0.52)) * p
            const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, 6)
            ag.addColorStop(0, '#fffacc')
            ag.addColorStop(1, '#e8a83800')
            ctx.fillStyle = ag
            ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#ddd'
            ctx.fillRect(ax - 5, ay - 1, 10, 2)
          }
          if (s.tick === HIT_T + 1) {
            const dmg = SUB_DMG[0][2]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `PIERCE! -${dmg}`, '#ffd700')
            s.gFlash = { color: 'rgba(255,210,50,', life: 1.2 }
            s.shakeFrames = 5
          }
        }
      }

      // ── MAGIC sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 1) {
        const x1 = KX + KNIGHT_IDLE[0].length * PS
        const y1 = GROUND - KH * 0.5

        if (s.selectedSub === 0) {
          const HIT_T = 18
          if (s.tick <= HIT_T) {
            const p = s.tick / HIT_T
            const fx = x1 + (GX - x1) * p
            const fy = y1 + ((GROUND - GH * 0.5) - y1) * p
            const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 11)
            fg.addColorStop(0, '#fff8e0')
            fg.addColorStop(0.4, '#fb923c')
            fg.addColorStop(1, '#fb923c00')
            ctx.fillStyle = fg
            ctx.beginPath(); ctx.arc(fx, fy, 11, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = `rgba(251,146,60,${0.12 * (1 - p)})`
            ctx.fillRect(0, 0, W, GROUND)
          }
          if (s.tick === HIT_T + 1) {
            const dmg = SUB_DMG[1][0]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `BLAZE! -${dmg}`, '#fb923c')
            s.gFlash = { color: 'rgba(251,146,60,', life: 1.6 }
            s.shakeFrames = 8
          }
        }

        if (s.selectedSub === 1) {
          if (s.tick === 5) {
            s.lightningPts = buildLightning(x1, y1, GX, GROUND - GH * 0.5)
            s.lightningLife = 18
            s.lightningColor = '#c8b0ff'
            const dmg = SUB_DMG[1][1]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `ARCANE! -${dmg}`, '#c8b0ff')
            s.gFlash = { color: 'rgba(157,127,255,', life: 1.8 }
            s.shakeFrames = 8
          }
          if (s.tick < 15) {
            ctx.fillStyle = `rgba(100,60,180,${Math.max(0, 0.25 - s.tick * 0.018)})`
            ctx.fillRect(0, 0, W, GROUND)
          }
        }

        if (s.selectedSub === 2) {
          const SHARD_DUR = 22
          const FREEZE_DUR = 28
          // Phase 1: ice shard travels to goblin
          if (s.tick <= SHARD_DUR) {
            const p = s.tick / SHARD_DUR
            const sx = x1 + (GX + 4 - x1) * p
            const sy = y1 + ((GROUND - GH * 0.5) - y1) * p
            const angle = Math.atan2((GROUND - GH * 0.5) - y1, GX + 4 - x1)
            ctx.save()
            ctx.translate(sx, sy)
            ctx.rotate(angle)
            // shard body
            ctx.beginPath()
            ctx.moveTo(10, 0)
            ctx.lineTo(2, -4)
            ctx.lineTo(-6, 0)
            ctx.lineTo(2, 4)
            ctx.closePath()
            ctx.fillStyle = '#c8eeff'
            ctx.fill()
            // bright tip
            ctx.beginPath()
            ctx.moveTo(10, 0)
            ctx.lineTo(4, -2)
            ctx.lineTo(4, 2)
            ctx.closePath()
            ctx.fillStyle = '#ffffff'
            ctx.fill()
            // icy trail
            for (let i = 1; i <= 4; i++) {
              const tp = Math.max(0, p - i * 0.06)
              const tx = x1 + (GX + 4 - x1) * tp - sx
              const ty = y1 + ((GROUND - GH * 0.5) - y1) * tp - sy
              ctx.globalAlpha = (1 - i * 0.22) * 0.5
              ctx.fillStyle = '#88d4ff'
              ctx.beginPath()
              ctx.arc(tx, ty, 3 - i * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
            ctx.restore()
          }
          // Phase 2: hit + freeze
          if (s.tick === SHARD_DUR + 1) {
            const dmg = SUB_DMG[1][2]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `FREEZE! -${dmg}`, '#88d4ff')
            s.gFlash = { color: 'rgba(180,230,255,', life: 1.2 }
            s.shakeFrames = 5
            s.freezeLife = FREEZE_DUR
          }
          if (s.tick > SHARD_DUR && s.tick <= SHARD_DUR + FREEZE_DUR) {
            const fp = 1 - (s.tick - SHARD_DUR) / FREEZE_DUR
            const gCX = GX + (GOBLIN_IDLE[0].length * PS) / 2
            const gCY = GROUND - GH * 0.55
            // ice block overlay
            ctx.save()
            ctx.globalAlpha = fp * 0.78
            ctx.fillStyle = '#a8e6ff'
            ctx.strokeStyle = '#e0f8ff'
            ctx.lineWidth = 1.5
            // main crystal shape
            const hw = (GOBLIN_IDLE[0].length * PS) / 2 + 4
            const hh = GH * 0.6
            ctx.beginPath()
            ctx.moveTo(gCX,           gCY - hh)
            ctx.lineTo(gCX + hw * 0.5, gCY - hh * 0.55)
            ctx.lineTo(gCX + hw,       gCY)
            ctx.lineTo(gCX + hw * 0.6, gCY + hh * 0.65)
            ctx.lineTo(gCX,            gCY + hh)
            ctx.lineTo(gCX - hw * 0.6, gCY + hh * 0.65)
            ctx.lineTo(gCX - hw,       gCY)
            ctx.lineTo(gCX - hw * 0.5, gCY - hh * 0.55)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            // inner highlight facet
            ctx.globalAlpha = fp * 0.35
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.moveTo(gCX - hw * 0.25, gCY - hh * 0.9)
            ctx.lineTo(gCX + hw * 0.15, gCY - hh * 0.5)
            ctx.lineTo(gCX - hw * 0.1,  gCY - hh * 0.1)
            ctx.lineTo(gCX - hw * 0.45, gCY - hh * 0.5)
            ctx.closePath()
            ctx.fill()
            // sparkle crystals
            ctx.globalAlpha = fp * 0.9
            const sparks = [
              [gCX - hw - 4, gCY - hh * 0.3],
              [gCX + hw + 4, gCY - hh * 0.2],
              [gCX,           gCY - hh - 6],
              [gCX + hw * 0.7, gCY + hh * 0.8],
            ]
            sparks.forEach(([sx2, sy2]) => {
              ctx.strokeStyle = '#d0f0ff'
              ctx.lineWidth = 1
              ctx.beginPath(); ctx.moveTo(sx2 - 4, sy2); ctx.lineTo(sx2 + 4, sy2); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2, sy2 - 4); ctx.lineTo(sx2, sy2 + 4); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2 - 3, sy2 - 3); ctx.lineTo(sx2 + 3, sy2 + 3); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2 + 3, sy2 - 3); ctx.lineTo(sx2 - 3, sy2 + 3); ctx.stroke()
            })
            ctx.restore()
          }
        }
      }

      // ── Lightning (arcane only) ──
      if (s.lightningPts && s.lightningLife > 0) {
        ctx.save()
        ctx.lineWidth = 2
        const lc = s.lightningColor
        s.lightningPts.forEach((pt, i) => {
          if (i === s.lightningPts.length - 1) return
          const next = s.lightningPts[i + 1]
          ctx.strokeStyle = i % 2 === 0 ? lc : '#ffffff'
          ctx.shadowColor = lc; ctx.shadowBlur = 10
          ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(next.x, next.y); ctx.stroke()
        })
        ctx.restore()
        s.lightningLife--
      }

      // ── ITEM sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 2) {
        const potX = KX + KNIGHT_IDLE[0].length * PS - 5
        const potY = GROUND - KH * 0.6
        const alpha = Math.sin(s.tick / 40 * Math.PI) * 0.7

        if (s.selectedSub === 0) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 9)
          pg.addColorStop(0, `rgba(104,211,145,${alpha * 0.7})`)
          pg.addColorStop(1, 'rgba(104,211,145,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 9, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[0]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `SM.POT +${heal}HP`, '#68d391')
          }
        }

        if (s.selectedSub === 1) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 13)
          pg.addColorStop(0, `rgba(104,211,145,${alpha})`)
          pg.addColorStop(1, 'rgba(104,211,145,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 13, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[1]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `POTION! +${heal}HP`, '#68d391')
          }
        }

        if (s.selectedSub === 2) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 10)
          pg.addColorStop(0, `rgba(251,196,60,${alpha * 0.8})`)
          pg.addColorStop(1, 'rgba(251,196,60,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 10, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[2]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `NOM NOM +${heal}HP`, '#fbc43c')
          }
        }
      }

      // ── Sprite flashes ──
      if (s.gFlash.life > 0) {
        ctx.fillStyle = s.gFlash.color + Math.min(s.gFlash.life, 1) * 0.45 + ')'
        ctx.fillRect(GX - 2, GROUND - GH - 2, GOBLIN_IDLE[0].length * PS + 4, GH + 4)
        s.gFlash.life -= 0.09
      }
      if (s.kFlash > 0) {
        ctx.fillStyle = `rgba(100,160,255,${Math.min(s.kFlash, 1) * 0.4})`
        ctx.fillRect(KX - 2, GROUND - KH - 2, KNIGHT_IDLE[0].length * PS + 4, KH + 4)
        s.kFlash -= 0.09
      }

      // ── Enemy counter damage ──
      if (s.phase === 'enemy' && s.tick === 10) {
        const dmg = s.selectedMain === 1 ? 10 : 8
        s.kHp = Math.max(0, s.kHp - dmg)
        addFloat(KX, GROUND - KH - 12, `COUNTER! -${dmg}`, '#ff6666')
        s.kFlash = 1.4
        s.shakeFrames = 8
      }

      // ── HP bars ──
      drawHpBar('JN',  s.kHp, KX,      GROUND - KH - 18, '#58a6ff')
      drawHpBar('GOB', s.gHp, GX - 10, GROUND - GH - 18, '#5aae2a')

      // ── RESULT overlay ──
      if (s.phase === 'result') {
        const msg = s.gHp <= 0 ? 'VICTORY!' : 'DEFEATED!'
        const col = s.gHp <= 0 ? '#9d7fff' : '#ff4444'
        ctx.save()
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, 0, W, GROUND)
        ctx.fillStyle = col
        ctx.font = 'bold 18px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText(msg, W / 2, GROUND / 2 + 6)
        ctx.restore()
      }

      // ── Floating numbers ──
      s.floats = s.floats.filter(f => {
        f.life -= 1 / 40
        f.y -= 0.6
        if (f.life <= 0) return false
        ctx.globalAlpha = f.life
        ctx.fillStyle = f.color
        ctx.font = 'bold 10px "Courier New"'
        ctx.textAlign = 'left'
        ctx.fillText(f.text, f.x, f.y)
        ctx.globalAlpha = 1
        return true
      })

      // ── Command box ──
      drawCommandBox()

      ctx.restore() // end shake translate

      // ── State machine transitions ──
      if (s.phase !== 'idle') {
        s.tick++

        const dur = s.selectedMain === 3 ? 40 : SUB_DUR[s.selectedMain][s.selectedSub]
        const hasCounter = s.selectedMain === 0 || s.selectedMain === 1

        if (s.phase === 'player' && s.tick >= dur) {
          if (hasCounter) {
            s.phase = 'enemy'; s.tick = 0
          } else {
            if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
            else { s.phase = 'idle'; s.tick = 0; s.hoverMain = -1; s.hoverSub = -1 }
          }
        }

        if (s.phase === 'enemy' && s.tick >= ENEMY_DUR) {
          if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
          else { s.phase = 'idle'; s.tick = 0; s.hoverMain = -1; s.hoverSub = -1 }
        }

        if (s.phase === 'result' && s.tick >= 90) { s.phase = 'reset'; s.tick = 0 }

        if (s.phase === 'reset') {
          s.kHp = 100; s.gHp = 100
          s.selectedMain = 0; s.selectedSub = 0; s.hoverMain = -1; s.hoverSub = -1
          s.floats = []; s.gFlash = { color: '', life: 0 }; s.kFlash = 0
          s.shakeFrames = 0; s.lightningPts = null; s.lightningLife = 0
          s.phase = 'idle'; s.tick = 0
        }
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="domain-canvas pixel-canvas"
      width={380}
      height={260}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// DOMAIN CARD + MAIN
// ─────────────────────────────────────────────────────────────
const DOMAINS = [
  { id: 'ml',   accent: ACCENT.ml,   label: 'Machine Learning',  desc: 'RL agents, custom Gymnasium environments, PPO training loops.',         skills: ['Python', 'Stable-Baselines3', 'Gymnasium', 'PPO / RL'], Anim: NeuralNetCanvas,    hint: '[ CLICK TO TRAIN ]' },
  { id: 'data', accent: ACCENT.llm,  label: 'Data & APIs',        desc: 'Live integrations — geolocation weather, S&P 500 market data, live airspace tracking, and Pokémon stats.', skills: ['REST APIs', 'Data Viz', 'React', 'Async/Await', 'JSON'], Anim: DataAPIShowcase,    hint: '[ CLICK TO CYCLE DATA SOURCE ]' },
  { id: 'web',  accent: ACCENT.web,  label: 'Web Development',    desc: 'Full-stack MERN — React frontends, Express REST APIs, Socket.io realtime, MongoDB schemas.',  skills: ['React', 'Express.js', 'MongoDB', 'Socket.io', 'Vite'],  Anim: WebCodeInspector,   hint: '[ CLICK TO CYCLE PANEL ]' },
  { id: 'game', accent: ACCENT.game, label: 'Game Development',   desc: 'Unity systems, C# scripting, enemy AI state machines, combat feel.',   skills: ['Unity', 'C#', 'Figma', 'Game Design'],                  Anim: PixelBattleCanvas,  hint: '[ HOVER COMMANDS ABOVE TO BATTLE ]' },
]

function DomainCard({ domain }) {
  const [clicks, setClicks] = useState(0)
  const { Anim } = domain
  const idle = clicks === 0

  return (
    <div
      className={`domain-card${idle ? ' domain-card--idle' : ' domain-card--on'}`}
      style={{ '--da': domain.accent }}
      onClick={() => setClicks(c => c + 1)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setClicks(c => c + 1)}
    >
      <div className="domain-anim">
        <Anim clicks={clicks} />
      </div>
      <div className="domain-info">
        <h3 className="domain-label">{domain.label}</h3>
        <p className="domain-desc">{domain.desc}</p>
        <div className="domain-chips">
          {domain.skills.map(s => (
            <span key={s} className="domain-chip">{s}</span>
          ))}
        </div>
        <span className={`domain-click-hint${idle ? '' : ' domain-click-hint--hidden'}`}>
          {domain.hint}
        </span>
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('skills-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills-container">
        <h2 className="section-label">// SKILLS</h2>
        <div className="domains-grid">
          {DOMAINS.map(d => <DomainCard key={d.id} domain={d} />)}
        </div>
      </div>
    </section>
  )
}
