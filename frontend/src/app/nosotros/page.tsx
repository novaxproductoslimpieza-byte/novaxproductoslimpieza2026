'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

function Counter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                start = value;
                clearInterval(timer);
            }
            setCount(Math.floor(start));
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
}

export default function NosotrosPage() {

    return (

        <main>

            {/* HERO */}
            <section
                className="d-flex align-items-center text-white"
                style={{
                    height: "480px",
                    backgroundImage: "url('/images/config_web/menu_nosotros/hero-cleaning.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                }}
            >

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.60)"
                    }}
                />

                <div className="container text-center position-relative">

                    <h1 className="display-3 fw-bold mb-3">
                        NOVAX
                    </h1>

                    <p className="lead mb-4">
                        Innovación y eficiencia en productos de limpieza
                    </p>

                    <Link
                        href="/"
                        className="btn btn-primary btn-lg px-5"
                    >
                        Ver Productos
                    </Link>

                </div>

            </section>


            {/* HISTORIA */}
            <section className="container py-5">

                <div className="row align-items-center g-5">

                    <div className="col-md-6">

                        <img
                            src="/images/config_web/menu_nosotros/factory.jpeg"
                            className="img-fluid rounded shadow"
                        />

                    </div>

                    <div className="col-md-6">

                        <h2 className="fw-bold mb-4">
                            Nuestra Empresa
                        </h2>

                        <p>
                            NOVAX desarrolla soluciones modernas de limpieza orientadas
                            a mejorar la eficiencia y el rendimiento en hogares,
                            comercios e industrias.
                        </p>

                        <p>
                            La empresa nace con el propósito de optimizar las
                            formulaciones de detergentes y ofrecer productos
                            de alto desempeño.
                        </p>

                        <p>
                            Nuestro enfoque combina investigación,
                            desarrollo de formulaciones y mejora continua
                            en procesos productivos.
                        </p>

                    </div>

                </div>

            </section>


            {/* CONTADORES */}
            <section className="bg-light py-5">

                <div className="container text-center">

                    <h2 className="fw-bold mb-5">
                        NOVAX en crecimiento
                    </h2>

                    <div className="row g-4">

                        <div className="col-md-3">
                            <h2 className="fw-bold text-primary">
                                <Counter value={20} />+
                            </h2>
                            <p>Formulaciones desarrolladas</p>
                        </div>

                        <div className="col-md-3">
                            <h2 className="fw-bold text-primary">
                                <Counter value={100} />+
                            </h2>
                            <p>Clientes atendidos</p>
                        </div>

                        <div className="col-md-3">
                            <h2 className="fw-bold text-primary">
                                <Counter value={10} />+
                            </h2>
                            <p>Productos proyectados</p>
                        </div>

                        <div className="col-md-3">
                            <h2 className="fw-bold text-primary">
                                <Counter value={100} />%
                            </h2>
                            <p>Compromiso con calidad</p>
                        </div>

                    </div>

                </div>

            </section>


            {/* MISION VISION */}
            <section className="container py-5">

                <div className="row g-4">

                    <div className="col-md-6">

                        <div className="card border-0 shadow-lg h-100">

                            <div className="card-body p-5">

                                <h3 className="fw-bold mb-3">
                                    Misión
                                </h3>

                                <p>
                                    Fabricar productos de limpieza eficientes que
                                    ofrezcan alto rendimiento, calidad y precios
                                    competitivos para nuestros clientes.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="card border-0 shadow-lg h-100">

                            <div className="card-body p-5">

                                <h3 className="fw-bold mb-3">
                                    Visión
                                </h3>

                                <p>
                                    Convertirnos en una empresa referente en el
                                    desarrollo de detergentes y soluciones de
                                    limpieza eficientes.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* VALORES */}
            <section className="bg-light py-5">

                <div className="container text-center">

                    <h2 className="fw-bold mb-5">
                        Nuestros Valores
                    </h2>

                    <div className="row g-4">

                        <div className="col-md-3">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <div className="fs-1">🏆</div>
                                <h5 className="fw-bold mt-3">Calidad</h5>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <div className="fs-1">💡</div>
                                <h5 className="fw-bold mt-3">Innovación</h5>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <div className="fs-1">🤝</div>
                                <h5 className="fw-bold mt-3">Compromiso</h5>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <div className="fs-1">⚙️</div>
                                <h5 className="fw-bold mt-3">Eficiencia</h5>
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* GALERIA */}
            <section className="container py-5">

                <h2 className="fw-bold text-center mb-5">
                    Nuestro Proceso
                </h2>

                <div className="row g-4">

                    <div className="col-md-4">
                        <img src="images\config_web\menu_nosotros\laboratorio.jpeg" className="img-fluid rounded shadow" />
                    </div>

                    <div className="col-md-4">
                        <img src="images\config_web\menu_nosotros\produccion.jpeg" className="img-fluid rounded shadow" />
                    </div>

                    <div className="col-md-4">
                        <img src="images\config_web\menu_nosotros\envasado.jpeg" className="img-fluid rounded shadow" />
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="bg-dark text-white text-center py-5">

                <div className="container">

                    <h3 className="fw-bold mb-4">
                        Conozca nuestras soluciones de limpieza
                    </h3>

                    <div className="d-flex justify-content-center gap-3">

                        <Link
                            href="/"
                            className="btn btn-primary px-4"
                        >
                            Ver Productos
                        </Link>

                        <Link
                            href="/contacto"
                            className="btn btn-outline-light px-4"
                        >
                            Contactar
                        </Link>

                    </div>

                </div>

            </section>

        </main>

    );
}
