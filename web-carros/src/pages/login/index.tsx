import { Container } from "../../components/container/Container";
import logoImg from "../../assets/logo.svg"
import { Link, useNavigate } from "react-router";

import { Input } from "../../components/input/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../services/supabaseClient";
import { useEffect, useState } from "react";

const schema = z.object({
    email: z.email("*Insira um email valido").nonempty("*O campo email é obrigatório"),
    password: z.string().nonempty("*O campo senha é obrigatorio")
})

type FormData = z.infer<typeof schema>

export function Login() {
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(()=> {
        async function signOut() {
            await supabase.auth.signOut()
        }
        signOut()
    },[])

    async function onSubmit(data: FormData) {
        const { email, password } = data;

        try {
            const { data: _session, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setError("Usuario ou senha incorreta!")
                console.error("Erro ao logar:", error.message);
            } else {
                
                setError("")
                navigate("/")

            }
        } catch (err) {
            console.error("Erro inesperado:", err);
        }

    }
    return (
        <Container>
            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 ">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img
                        src={logoImg}
                        alt="logo image"
                        className="w-full"
                    />
                </Link>

                <form className="bg-white w-full max-w-xl p-4 rounded-lg flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        name="email"
                        type="text"
                        placeholder="Digite o email..."
                        error={errors.email?.message}
                        register={register}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Digite a senha..."
                        error={errors.password?.message}
                        register={register}
                    />

                    {error && (<span className="text-red-500">{error}</span>)}

                    <button type="submit" className="w-full h-10 p-2 bg-black rounded-lg text-white font-medium hover:scale-102 transition-all duration-200 cursor-pointer">Acessar</button>
                </form>

                <span className="my-8">Ainda não possui uma conta?<a href="/register" className="hover:opacity-75"> Cadastre-se</a></span>

            </div>
        </Container>
    )
}