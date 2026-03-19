// src/app/acercade/page.tsx
import Image from "next/image";

export default function About() {
    return (
        <div className="app-wrapper">
            {/* Hero Section */}
            <section
                className="page"
                style={{
                    background: "url('/images/acercade/hero.jpg') center/cover no-repeat",
                    color: "#fff",
                    textAlign: "center",
                    padding: "6rem 1rem",
                    position: "relative",
                }}
            >
                <div style={{ maxWidth: "800px", margin: "0 auto", animation: "fadeIn 1s ease forwards" }}>
                    <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>
                        Acerca de Novax
                    </h1>
                    <p style={{ fontSize: "1.25rem", lineHeight: 1.6 }}>
                        Innovando en soluciones de detergentes líquidos y sólidos, comprometidos con la calidad, la eficiencia y la satisfacción de nuestros clientes.
                    </p>
                </div>
            </section>

            {/* Historia Section */}
            <section className="page container" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: "1 1 400px", animation: "slideInLeft 1s ease forwards" }}>
                    <h2 className="window-title">Nuestra Historia</h2>
                    <p>
                        Novax nació con el objetivo de ofrecer productos de limpieza innovadores, de alta calidad y accesibles. Desde nuestros inicios, hemos enfocado nuestro trabajo en procesos eficientes y sostenibles.
                    </p>
                </div>
                <div style={{ flex: "1 1 400px", animation: "slideInRight 1s ease forwards" }}>
                    <Image
                        src="/images/acercade/historia.jpg"
                        alt="Historia Novax"
                        width={600}
                        height={400}
                        style={{ borderRadius: "16px", objectFit: "cover" }}
                    />
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="page container" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div className="card" style={{ flex: "1 1 300px", animation: "fadeIn 1s ease forwards" }}>
                    <h3>Misión</h3>
                    <p>
                        Ofrecer detergentes de calidad superior, con innovación constante y un enfoque sostenible para nuestros clientes.
                    </p>
                </div>
                <div className="card" style={{ flex: "1 1 300px", animation: "fadeIn 1.2s ease forwards" }}>
                    <h3>Visión</h3>
                    <p>
                        Ser líderes en soluciones de limpieza en Latinoamérica, destacando por nuestro compromiso con la excelencia y la innovación.
                    </p>
                </div>
            </section>

            {/* Valores */}
            <section className="page container">
                <h2 className="window-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Nuestros Valores</h2>
                <div className="products-grid" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {[
                        { title: "Integridad", img: "/images/acercade/values/integridad.jpg" },
                        { title: "Innovación", img: "/images/acercade/values/innovacion.jpg" },
                        { title: "Calidad", img: "/images/acercade/values/calidad.jpg" },
                        { title: "Sustentabilidad", img: "/images/acercade/values/sustentabilidad.jpg" },
                    ].map((v, i) => (
                        <div
                            className="card"
                            key={i}
                            style={{
                                textAlign: "center",
                                animation: `fadeIn ${1 + i * 0.3}s ease forwards`,
                                flex: "1 1 250px",
                                maxWidth: "250px",
                                overflow: "hidden",
                                borderRadius: "16px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <div style={{ width: "100%", height: "0", paddingBottom: "100%", position: "relative" }}>
                                <Image
                                    src={v.img}
                                    alt={v.title}
                                    fill
                                    style={{ objectFit: "cover", borderRadius: "16px" }}
                                />
                            </div>
                            <h4 style={{ marginTop: "1rem", fontWeight: 600 }}>{v.title}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Equipo */}
            <section className="page container">
                <h2 className="window-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Nuestro Equipo</h2>
                <div className="products-grid">
                    {[
                        { name: "Juan Pérez", role: "CEO", img: "/images/acercade/juan.jpg" },
                        { name: "Ana López", role: "Directora de Producción", img: "/images/acercade/ana.jpg" },
                        { name: "Carlos Martínez", role: "Marketing", img: "/images/acercade/carlos.jpg" },
                        { name: "Sofía Torres", role: "Desarrollo de Producto", img: "/images/acercade/sofia.jpg" },
                    ].map((member, i) => (


                        <div
                            className="card"
                            key={i}
                            style={{
                                textAlign: "center",
                                animation: `fadeIn ${1 + i * 0.3}s ease forwards`,
                                flex: "1 1 250px",
                                maxWidth: "250px",
                                overflow: "hidden",
                                borderRadius: "16px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <div style={{ width: "100%", height: "0", paddingBottom: "100%", position: "relative" }}>
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    fill
                                    style={{ objectFit: "cover", borderRadius: "16px" }}
                                />
                            </div>
                            <h4 style={{ marginTop: "1rem", fontWeight: 600 }}>{member.name}</h4>
                        </div>


                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="page container" style={{ textAlign: "center", padding: "4rem 1rem" }}>
                <h2 className="window-title" style={{ marginBottom: "1rem" }}>Conoce Nuestros Productos</h2>
                <p style={{ marginBottom: "2rem" }}>
                    Descubre la calidad y eficiencia de nuestros detergentes líquidos y sólidos.
                </p>
                <a href="/" className="btn btn-primary btn-lg">Ver Productos</a>
            </section>
        </div>
    );
}