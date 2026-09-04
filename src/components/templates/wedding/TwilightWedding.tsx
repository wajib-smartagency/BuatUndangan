"use client";
import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, RsvpProps } from '@/types/invitation';

interface TwilightWeddingProps {
  data: WeddingData;
  rsvp?: RsvpProps;
  rsvpsList?: any[];
}

export default function TwilightWedding({ data, rsvp, rsvpsList = [] }: TwilightWeddingProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const eventDate = new Date(data.acaraAkad.tanggal).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = Math.max(0, eventDate - now);
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data.acaraAkad.tanggal]);

  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    revealRefs.current.forEach(el => {
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const copyToClipboard = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = 'Tersalin';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  };

  const padNum = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="twilight-theme">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@300;400;500;600&display=swap');
        
        .twilight-theme {
          --twilight: #332b52;
          --twilight-deep: #221c39;
          --cream: #faf3ee;
          --mauve: #c98fa0;
          --sand: #e7d9c9;
          --line: rgba(51,43,82,0.14);
          --shadow: 0 20px 44px rgba(34,28,57,0.18);
          
          background: var(--twilight-deep);
          color: var(--twilight);
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }

        .tw-frame {
          max-width: 480px;
          margin: 0 auto;
          background: var(--cream);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .twilight-theme .display, .twilight-theme h1, .twilight-theme h2, .twilight-theme h3 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 600;
          margin: 0;
          color: var(--twilight);
        }

        .twilight-theme .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--mauve);
          font-weight: 600;
          font-style: normal;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.55;
          z-index: 0;
          pointer-events: none;
        }
        .blob-a { width: 260px; height: 260px; background: var(--mauve); top: 520px; left: -90px; }
        .blob-b { width: 220px; height: 220px; background: var(--sand); top: 1400px; right: -80px; }
        .blob-c { width: 200px; height: 200px; background: var(--twilight); opacity: 0.12; top: 2300px; left: -60px; }
        
        .twilight-theme section, .twilight-theme footer { position: relative; z-index: 1; }

        .twilight-theme section { padding: 4.2rem 1.9rem; text-align: center; border-bottom: 1px solid var(--line); }
        .twilight-theme .reveal { opacity: 0; transform: translateY(20px); transition: opacity .8s ease, transform .8s ease; }
        .twilight-theme .reveal.in { opacity: 1; transform: none; }

        #hero-parallax {
          padding: 0; border-bottom: none; height: 56vh; min-height: 340px;
          overflow: hidden; position: relative;
        }
        #hero-parallax .layer { position: absolute; inset: -10% -10%; }
        #hero-parallax .layer.back img { width: 100%; height: 120%; object-fit: cover; }
        #hero-parallax .layer.back { z-index: 0; }
        #hero-parallax .layer.front {
          z-index: 1; inset: auto; bottom: 6%; left: 8%; right: 8%;
          background: rgba(250,243,238,0.92);
          border-radius: 16px; padding: 1.4rem 1.2rem;
          text-align: center; box-shadow: var(--shadow);
        }
        #hero-parallax .layer.front .names { font-size: 2rem; margin-top: 0.3rem; }
        #hero-parallax .layer.front .amp-soft { color: var(--mauve); }
        #hero-parallax .layer.front .hero-date {
          font-size: 0.78rem; color: var(--twilight); opacity: 0.7; margin-top: 0.4rem;
          font-family: 'Manrope',sans-serif; font-style: normal; letter-spacing: 0.06em;
        }

        .countdown { display: flex; justify-content: center; gap: 0.7rem; margin-top: 2.2rem; }
        .cd-box { background: var(--twilight); color: var(--cream); width: 62px; padding: 0.7rem 0.2rem; border-radius: 14px; }
        .cd-box .num { font-family: 'Playfair Display', serif; font-style: normal; font-size: 1.55rem; display: block; }
        .cd-box .lbl { font-size: 0.58rem; letter-spacing: 0.1em; color: var(--sand); }

        .verse { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.15rem; line-height: 1.75; color: var(--twilight); max-width: 330px; margin: 0 auto; }
        .verse cite { display: block; margin-top: 0.7rem; font-style: normal; font-size: 0.7rem; letter-spacing: 0.12em; color: var(--mauve); font-family: 'Manrope',sans-serif; }

        .couple-card { margin-top: 2.2rem; }
        .portrait { width: 140px; height: 140px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(160deg,var(--sand),var(--mauve)); display: flex; align-items: center; justify-content: center; color: var(--cream); font-size: 0.75rem; overflow:hidden;}
        .portrait img {width: 100%; height: 100%; object-fit: cover;}
        .couple-card h3 { font-size: 1.55rem; }
        .couple-card p { font-size: 0.83rem; line-height: 1.6; color: #5a5270; margin-top: 0.35rem; font-style: normal; }
        .divider-row { display: flex; align-items: center; gap: 0.8rem; margin: 2.4rem 0; }
        .divider-row .line { flex: 1; height: 1px; background: var(--line); }
        .divider-row span { font-family: 'Playfair Display', serif; font-style: italic; color: var(--mauve); }

        .event-card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 1.6rem 1.3rem; margin-top: 1.3rem; box-shadow: var(--shadow); }
        .event-card h3 { font-size: 1.45rem; }
        .event-card .when { margin-top: 0.5rem; font-size: 0.88rem; color: var(--twilight); font-style: normal; }
        .event-card .where { font-size: 0.82rem; color: #5a5270; margin-top: 0.2rem; }
        .maps-link { display: inline-block; margin-top: 0.9rem; font-size: 0.75rem; letter-spacing: 0.06em; color: var(--mauve); border-bottom: 1px solid var(--mauve); padding-bottom: 2px; }

        #para-gallery { text-align: left; }
        .pg-heading { text-align: center; }
        .pg-grid { display: flex; gap: 10px; margin-top: 1.8rem; }
        .pg-col { flex: 1; display: flex; flex-direction: column; gap: 10px; will-change: transform; }
        .pg-col img { width: 100%; border-radius: 10px; display: block; object-fit: cover; }
        .pg-col.a img:nth-child(1) { aspect-ratio: 3/4; }
        .pg-col.a img:nth-child(2) { aspect-ratio: 1/1; }
        .pg-col.b img:nth-child(1) { aspect-ratio: 1/1; }
        .pg-col.b img:nth-child(2) { aspect-ratio: 3/4; }
        .pg-col.b { margin-top: 2.4rem; }

        .env-box { background: var(--twilight); color: var(--cream); border-radius: 20px; padding: 2.1rem 1.5rem; margin-top: 1.8rem; }
        .env-box h3 { color: var(--cream); }
        .env-box p { font-size: 0.85rem; line-height: 1.6; color: var(--sand); font-style: normal; }
        .bank-row { background: rgba(250,243,238,0.06); border: 1px solid rgba(250,243,238,0.18); border-radius: 12px; padding: 0.9rem 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; text-align: left; }
        .bank-row .num { font-family: 'Playfair Display',serif; font-style: normal; font-size: 1.1rem; }
        .bank-row button { background: transparent; border: 1px solid var(--mauve); color: var(--mauve); padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.68rem; letter-spacing: 0.06em; cursor: pointer; transition: all 0.3s ease;}
        .bank-row button.copied { background: var(--mauve); color: var(--twilight-deep); }

        .field { text-align: left; margin-top: 1.1rem; }
        .field label { display: block; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--twilight); margin-bottom: 0.35rem; }
        .field input, .field select, .field textarea { width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 0.68rem 0.85rem; font-family: inherit; font-size: 0.9rem; background: #fff; color: var(--twilight); outline: none;}
        .field textarea { resize: vertical; min-height: 78px; }
        .submit-btn { margin-top: 1.4rem; width: 100%; background: var(--mauve); color: #fff; border: none; padding: 0.88rem; border-radius: 999px; letter-spacing: 0.08em; font-size: 0.84rem; cursor: pointer; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .wish-list { margin-top: 1.5rem; text-align: left; }
        .wish { border-bottom: 1px solid var(--line); padding: 0.85rem 0; }
        .wish .who { font-size: 0.88rem; font-weight: 600; }
        .wish .who span { font-weight: 400; color: var(--mauve); font-size: 0.7rem; margin-left: 0.4rem; }
        .wish .msg { font-size: 0.83rem; color: #5a5270; margin-top: 0.2rem; line-height: 1.5; }

        footer { padding: 3rem 1.9rem 2.4rem; text-align: center; background: var(--twilight-deep); color: var(--sand); }
        footer .display { color: var(--cream); font-size: 1.7rem; }
        footer p { font-size: 0.78rem; margin-top: 0.6rem; line-height: 1.6; font-style: normal; }
      `}</style>

      <div className="tw-frame">
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>
        <div className="blob blob-c"></div>

        {/* HERO PARALLAX */}
        <section id="hero-parallax">
          <div className="layer back">
            {data.galeri && data.galeri.length > 0 ? (
              <img src={data.galeri[0]} alt="Hero" />
            ) : (
              <div style={{width:'100%', height:'100%', background:'var(--twilight-deep)'}}></div>
            )}
          </div>
          <div className="layer front">
            <div className="eyebrow">
              {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
            <div className="names">{data.pria.namaPanggilan} <span className="amp-soft">&amp;</span> {data.wanita.namaPanggilan}</div>
            <div className="hero-date">{data.acaraAkad.lokasi}</div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="countdown">
            <div className="cd-box"><span className="num">{padNum(timeLeft.days)}</span><span className="lbl">HARI</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.hours)}</span><span className="lbl">JAM</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.minutes)}</span><span className="lbl">MENIT</span></div>
            <div className="cd-box"><span className="num">{padNum(timeLeft.seconds)}</span><span className="lbl">DETIK</span></div>
          </div>
        </section>

        {/* VERSE */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <p className="verse">
            "{data.kutipan}"
            {data.sumberKutipan && <cite>{data.sumberKutipan}</cite>}
          </p>
        </section>

        {/* MEMPELAI */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">Mempelai</div>
          <div className="couple-card">
            <div className="portrait">
              {data.wanita.foto ? <img src={data.wanita.foto} alt={data.wanita.namaLengkap} /> : "Foto"}
            </div>
            <h3>{data.wanita.namaLengkap}</h3>
            <p>{data.wanita.namaBapak && data.wanita.namaIbu ? `Putri dari Bapak ${data.wanita.namaBapak} & Ibu ${data.wanita.namaIbu}` : ''}</p>
          </div>

          <div className="divider-row"><div className="line"></div><span>&amp;</span><div className="line"></div></div>

          <div className="couple-card">
            <div className="portrait">
              {data.pria.foto ? <img src={data.pria.foto} alt={data.pria.namaLengkap} /> : "Foto"}
            </div>
            <h3>{data.pria.namaLengkap}</h3>
            <p>{data.pria.namaBapak && data.pria.namaIbu ? `Putra dari Bapak ${data.pria.namaBapak} & Ibu ${data.pria.namaIbu}` : ''}</p>
          </div>
        </section>

        {/* EVENTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">Rangkaian Acara</div>
          <div className="event-card">
            <h3>{data.acaraAkad.nama}</h3>
            <div className="when">
              {new Date(data.acaraAkad.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })} · {data.acaraAkad.waktuMulai} WIB
            </div>
            <div className="where">{data.acaraAkad.lokasi}</div>
            {data.acaraAkad.linkGoogleMaps && (
              <a className="maps-link" href={data.acaraAkad.linkGoogleMaps} target="_blank" rel="noreferrer">Buka Google Maps</a>
            )}
          </div>
          <div className="event-card">
            <h3>{data.acaraResepsi.nama}</h3>
            <div className="when">
              {new Date(data.acaraResepsi.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })} · {data.acaraResepsi.waktuMulai} WIB
            </div>
            <div className="where">{data.acaraResepsi.lokasi}</div>
            {data.acaraResepsi.linkGoogleMaps && (
              <a className="maps-link" href={data.acaraResepsi.linkGoogleMaps} target="_blank" rel="noreferrer">Buka Google Maps</a>
            )}
          </div>
        </section>

        {/* GALLERY */}
        {(data.galeri || []).length > 0 && (
          <section id="para-gallery">
            <div className="pg-heading reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
              <div className="eyebrow">Momen Kasih</div>
            </div>
            <div className="pg-grid">
              <div className="pg-col a reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
                {(data.galeri || []).slice(0, 2).map((url, i) => (
                  <img key={i} src={url} alt={`Gallery A${i}`} />
                ))}
              </div>
              <div className="pg-col b reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
                {(data.galeri || []).slice(2, 4).map((url, i) => (
                  <img key={i} src={url} alt={`Gallery B${i}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GIFTS */}
        <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="eyebrow">Amplop Digital</div>
          <div className="env-box">
            <h3>Tanda Kasih</h3>
            <p>Doa restu Anda adalah karunia terbesar bagi kami. Jika ingin memberi tanda kasih secara cashless, dapat melalui rekening berikut.</p>
            {(data.rekening || []).map((rek, idx) => (
              <div key={idx} className="bank-row">
                <div>
                  <div style={{fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--mauve)'}}>{rek.namaBank} — a.n {rek.atasNama}</div>
                  <div className="num">{rek.noRekening}</div>
                </div>
                <button onClick={(e) => copyToClipboard(rek.noRekening, e)}>Salin</button>
              </div>
            ))}
          </div>
        </section>

        {/* RSVP */}
        {rsvp && (
          <section className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
            <div className="eyebrow">Konfirmasi Hadir</div>
            {!rsvp.hasSubmitted ? (
              <form onSubmit={rsvp.onSubmit}>
                <div className="field">
                  <label>Nama Lengkap</label>
                  <input type="text" value={rsvp.name} onChange={(e) => rsvp.onNameChange(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Status Kehadiran</label>
                  <select value={rsvp.status} onChange={(e) => rsvp.onStatusChange(e.target.value)}>
                    <option value="hadir">Hadir</option>
                    <option value="tidak hadir">Tidak Hadir</option>
                  </select>
                </div>
                <div className="field">
                  <label>Ucapan &amp; Doa</label>
                  <textarea value={rsvp.message} onChange={(e) => rsvp.onMessageChange(e.target.value)} required></textarea>
                </div>
                <button type="submit" disabled={rsvp.isSubmitting} className="submit-btn">
                  {rsvp.isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            ) : (
              <div className="env-box" style={{marginTop: '1.4rem'}}>
                Terima kasih atas doa restu Anda.
              </div>
            )}

            <div className="wish-list">
              {rsvpsList.map((r, idx) => (
                <div key={idx} className="wish">
                  <div className="who">{r.guests?.name} <span>{r.status}</span></div>
                  <div className="msg">{r.message}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="reveal" ref={(el) => { if(el) revealRefs.current.push(el); }}>
          <div className="display">{data.pria.namaPanggilan} &amp; {data.wanita.namaPanggilan}</div>
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir.</p>
        </footer>
      </div>
    </div>
  );
}
