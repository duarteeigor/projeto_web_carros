import { FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container/Container";
import { PainelHeader } from "../../../components/painelheader/PainelHeader";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  nameCar: z.string().nonempty("O campo nome do carro é obrigatorio"),
  marca: z.string().nonempty("O campo é obrigatorio"),
  year: z.string().nonempty("O campo é obrigatorio"),
  km: z.string().nonempty("O campo é obrigatorio"),
  value: z.string().nonempty("O campo é obrigatorio"),
  city: z.string().nonempty("O campo é obrigatorio"),
  phone: z.string().nonempty("O campo é obrigatorio"),
  whatsapp: z.string().nonempty("O campo é obrigatorio"),
  description: z.string().nonempty("O campo é obrigatorio")
})

type FormData = z.infer<typeof schema>


export function DashboardNew() {

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  async function onSubmit(data: FormData){
    console.log(data)
  }

  return (

    <Container>
      <PainelHeader />
      <div className="w-full flex flex-col  bg-white my-8 gap-2 p-3 rounded-lg">
        <button className="border-2 border-gray-600 rounded-lg w-48 flex items-center justify-center h-32">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>

          <div className="cursor-pointer">
            <input type="file" accept="image/*" className="opacity-0 cursor-pointer" />
          </div>
        </button>
      </div>


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full max-w-7xl bg-white p-3 rounded-lg flex flex-col">
          <div>
            <span>Nome do carro</span>
            <Input
              placeholder="Ex: Corolla"
              type="text"
              name="nameCar"
              register={register}
              error={errors.nameCar?.message}
            />

            <span>Marca</span>
            <Input
              placeholder="Ex: Ford"
              type="text"
              name="marca"
              register={register}
              error={errors.marca?.message}
            />

            <div className="flex gap-6">
              <div className="w-full flex flex-col">
                <span>Ano</span>
                <Input
                  placeholder="Ex: 2022"
                  type="number"
                  name="year"
                  register={register}
                  error={errors.year?.message}
                />
              </div>

              <div className="w-1/2 flex flex-col">
                <label>Km rodados</label>
                <Input
                  placeholder="Ex: 80.000"
                  type="number"
                  name="km"
                  register={register}
                  error={errors.km?.message}
                />
              </div>
            </div>

            <label>Valor em R$</label>
            <Input
              placeholder="Ex: 105.000"
              type="number"
              name="value"
              register={register}
              error={errors.value?.message}
            />

            <label>Cidade</label>
            <Input
              placeholder="Ex: Ipatinga"
              type="text"
              name="city"
              register={register}
              error={errors.city?.message}
            />

            <div className="flex gap-6">
              <div className="flex flex-col w-full">
                <label>Telefone</label>
                <Input
                  placeholder="Ex: (31)9999-9999"
                  type="text"
                  name="phone"
                  register={register}
                  error={errors.phone?.message}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label>Whatsapp</label>
                <Input
                  placeholder="Ex: (31)9999-9999"
                  type="text"
                  name="whatsapp"
                  register={register}
                  error={errors.whatsapp?.message} 
                />
              </div>

            </div>

            <label>Descrição</label>
            <textarea
              className="border-2 w-full h-24 rounded-lg border-gray-200 outline-none px-2 py-2"
              {...register("description")}
              name="description"
              placeholder="Digite uma descrição..."
            />
            {errors.description && <p className="mb-2 text-red-500">{errors.description.message}</p>}

            <button type="submit" className="w-full max-w-7xl p-1 bg-black text-2xl text-white font-medium rounded-lg">Cadastrar</button>
          </div>
        </div>
      </form>
    </Container>

  )
}