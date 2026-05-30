import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. ESTADOS
  const [stickers, setStickers] = useState([
    { id: 1, nombre: 'Sticker estándar', precio: 2500, cantidad: 3 },
    { id: 2, nombre: 'Holográfico', precio: 4000, cantidad: 2 }
  ]);
  const [costoHojas, setCostoHojas] = useState(0);
  const [ayudantes, setAyudantes] = useState([]);
  const [resultados, setResultados] = useState({
    totalVentas: 0,
    costoHojas: 0,
    gananciaBruta: 0,
    pagoAyudantesTotal: 0,
    detalleAyudantes: [], // Guardaremos nombre y monto de cada uno
    porPersona: 0,
    totalDistribuido: 0,
    calculado: false
  });

  // Colores para los ayudantes (se irán rotando)
  const coloresAyudantes = ['#b16cff', '#54a3f7', '#f7a354', '#f754e3', '#54f7a3'];

  // 2. FUNCIONES
  const manejarCambioSticker = (id, campo, valor) => {
    setStickers(stickers.map(s => s.id === id ? { ...s, [campo]: valor } : s));
  };

  const agregarSticker = () => {
    setStickers([...stickers, { id: Date.now(), nombre: '', precio: '', cantidad: '' }]);
  };

  const eliminarSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const agregarAyudante = () => {
    setAyudantes([...ayudantes, { id: Date.now(), nombre: '', porcentaje: '' }]);
  };

  const manejarCambioAyudante = (id, campo, valor) => {
    setAyudantes(ayudantes.map(a => a.id === id ? { ...a, [campo]: valor } : a));
  };

  const eliminarAyudante = (id) => {
    setAyudantes(ayudantes.filter(a => a.id !== id));
  };

  // CÁLCULO MATEMÁTICO
  const calcularGanancias = () => {
    let ventas = 0;
    stickers.forEach(s => {
      ventas += (parseFloat(s.precio) || 0) * (parseFloat(s.cantidad) || 0);
    });

    const costo = parseFloat(costoHojas) || 0;
    const bruta = Math.max(0, ventas - costo);

    // Calculamos el pago individual de cada ayudante
    let sumaComisiones = 0;
    const detalle = ayudantes.map((a, index) => {
      const pct = parseFloat(a.porcentaje) || 0;
      const monto = bruta * (pct / 100);
      sumaComisiones += monto;
      return {
        id: a.id,
        nombre: a.nombre || `Ayudante ${index + 1}`,
        monto: monto,
        color: coloresAyudantes[index % coloresAyudantes.length] // Asigna color de la lista
      };
    });

    const restante = Math.max(0, bruta - sumaComisiones);
    const mitad = restante / 2;

    setResultados({
      totalVentas: ventas,
      costoHojas: costo,
      gananciaBruta: bruta,
      pagoAyudantesTotal: sumaComisiones,
      detalleAyudantes: detalle,
      porPersona: mitad,
      totalDistribuido: ventas,
      calculado: true
    });
  };

  const f = (num) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num).replace('ARS', '$');

  return (
    <div className="app">
      {/* TÍTULO */}
      <div className="title">
        <div className="star">⭐</div>
        <h1>Calculadora<br /><span className="gradient">Multiprecios</span></h1>
        <div className="subtitle">Stickers con distintos precios · División justa automática</div>
      </div>

      {/* STICKERS */}
      <div className="card coral">
        <div className="section-title" style={{ color: '#ff6b81' }}>🏷️ Stickers y Precios</div>
        {stickers.map((sticker) => (
          <div className="row" key={sticker.id} style={{ alignItems: 'center', marginBottom: '10px' }}>
            <span onClick={() => eliminarSticker(sticker.id)} style={{ color: '#ff6b81', fontSize: '20px', cursor: 'pointer' }}>➖</span>
            <input type="text" placeholder="Nombre" value={sticker.nombre} onChange={(e) => manejarCambioSticker(sticker.id, 'nombre', e.target.value)} />
            <span style={{ color: '#a0a0a0' }}>$</span>
            <input type="number" placeholder="0" value={sticker.precio} onChange={(e) => manejarCambioSticker(sticker.id, 'precio', e.target.value)} style={{ width: '85px' }} />
            <input type="number" placeholder="Cant" value={sticker.cantidad} onChange={(e) => manejarCambioSticker(sticker.id, 'cantidad', e.target.value)} style={{ width: '70px' }} />
            <span onClick={() => eliminarSticker(sticker.id)} style={{ color: '#ff6b81', fontSize: '20px', cursor: 'pointer' }}>🗑️</span>
          </div>
        ))}
        <button className="btn-add" onClick={agregarSticker} style={{ color: '#ff6b81' }}>+ Agregar tipo de sticker</button>
      </div>

      {/* HOJAS */}
      <div className="card yellow">
        <div className="section-title" style={{ color: '#f7d154' }}>📦 Costo de Hojas</div>
        <input type="number" placeholder="Costo total de las hojas ($)" value={costoHojas || ''} onChange={(e) => setCostoHojas(e.target.value)} />
      </div>

      {/* AYUDANTES (Entrada) */}
      <div className="card purple">
        <div className="section-title" style={{ color: '#b16cff' }}>👥 Ayudantes</div>
        {ayudantes.map((a) => (
          <div className="row" key={a.id} style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Nombre" value={a.nombre} onChange={(e) => manejarCambioAyudante(a.id, 'nombre', e.target.value)} />
            <input type="number" placeholder="%" value={a.porcentaje} onChange={(e) => manejarCambioAyudante(a.id, 'porcentaje', e.target.value)} style={{ width: '70px' }} />
            <span onClick={() => eliminarAyudante(a.id)} style={{ color: '#b16cff', fontSize: '20px', cursor: 'pointer' }}>🗑️</span>
          </div>
        ))}
        <button className="btn-add" onClick={agregarAyudante} style={{ color: '#b16cff' }}>+ Agregar ayudante</button>
      </div>

      {/* BOTÓN DIVIDIR */}
      <button className="btn-main" onClick={calcularGanancias}>DIVIDIR GANANCIAS 🎯</button>

      {/* RESULTADOS */}
      <div className="result">
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f7d154', marginBottom: '15px' }}>📈 Resultado del Día</div>
        <div className="stats">
          <div className="stat cyanBox">
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>TOTAL VENTAS</div>
            <div className="value cyan">{f(resultados.totalVentas)}</div>
          </div>
          <div className="stat redBox">
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>COSTO HOJAS</div>
            <div className="value red">{f(resultados.costoHojas)}</div>
          </div>
          <div className="stat yellowBox big">
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>GANANCIA BRUTA</div>
            <div className="value yellowText">{f(resultados.gananciaBruta)}</div>
          </div>
        </div>

        <div style={{ margin: '20px 0 10px 0', color: '#a0a0a0', fontSize: '14px' }}>Reparto de ganancias:</div>

        {/* Tarjetas Dinámicas de Ayudantes */}
        {resultados.detalleAyudantes.map((ayu) => (
          <div className="person" key={ayu.id} style={{ border: `2px solid ${ayu.color}`, marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '30px' }}>🤝</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '17px', color: ayu.color }}>{ayu.nombre}</div>
                <div style={{ fontSize: '11px', color: '#a0a0a0' }}>(Ayudante)</div>
              </div>
            </div>
            <div className="value" style={{ fontSize: '26px', color: ayu.color }}>{f(ayu.monto)}</div>
          </div>
        ))}

        {/* Tú (Impresora) */}
        <div className="person redBox">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🖨️</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Tú</div>
              <div style={{ fontSize: '12px', color: '#a0a0a0' }}>(Impresora)</div>
            </div>
          </div>
          <div className="value red" style={{ fontSize: '28px' }}>{f(resultados.porPersona)}</div>
        </div>

        {/* Tu amiga (Vendedora) */}
        <div className="person cyanBox">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🛍️</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Tu amiga</div>
              <div style={{ fontSize: '12px', color: '#a0a0a0' }}>(Vendedora)</div>
            </div>
          </div>
          <div className="value cyan" style={{ fontSize: '28px' }}>{f(resultados.porPersona)}</div>
        </div>

        {/* Total Final */}
        <div className="person greenBox" style={{ background: '#050505', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <span style={{ color: '#45ff8a', fontSize: '20px' }}>✅</span> Total distribuido
          </div>
          <div className="value green" style={{ fontSize: '28px' }}>{f(resultados.totalDistribuido)}</div>
        </div>
      </div>

      <div className="footer" style={{ textAlign: 'center', color: '#666', fontSize: '11px', padding: '15px 0' }}>
        hecho con 💛 para tu negocio de stickers
      </div>
    </div>
  );
}

export default App;
