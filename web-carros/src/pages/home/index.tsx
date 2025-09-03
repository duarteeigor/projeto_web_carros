import { Container } from "../../components/container/Container";

export function Home(){
    return(
        <Container>
            <div className="flex items-center justify-around w-full max-w-3xl h-20 mx-auto mb-6 rounded-2xl bg-white">
                <input
                    type="text"
                    placeholder="Digite o nome do carro..."
                    className="w-8/12 p-2 border border-gray-300 rounded-2xl outline-none" 
                />

                <button className="w-3/12 bg-red-500 p-2 rounded-2xl text-white text-lg font-medium cursor-pointer hover:bg-red-900 transition-colors">Buscar</button>

            </div>

            <h1 className="text-center text-2xl font-medium ">Carros novos e usados em todo o Brasil!</h1>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                <section className="w-full bg-white rounded-lg">
                    <img
                        src="https://s2-autoesporte.glbimg.com/S_COEpqnvoKmJ7YnAtRzyc6mazk=/0x0:1917x1078/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2021/d/q/Z4Ac1ETCi1diySBgBU2Q/20210411-162238.jpg"
                        alt="bmw 320i"
                        className="w-full rounded-lg  mb-2 max-h-72 hover:scale-105" 
                    />
                    <p className="font-bold mt-1 mb-2 px-2">BMW 320i</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700 mb-6">Ano 2016/2017 | 23.000 km</span>
                        <strong className="font-medium">R$ 190.000</strong>
                    </div>
                    

                    <div className="w-full h-px bg-slate-200 my-2"></div>

                    <div className="px-2 pb-2">
                        <span className="text-zinc-700">Campo Grande - MS</span>
                    </div>
                </section>
            </main>
        </Container>
    )
}