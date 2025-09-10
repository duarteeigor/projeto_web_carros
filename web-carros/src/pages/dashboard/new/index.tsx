import { useContext, useState, type ChangeEvent } from "react"
import { FiTrash, FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container/Container";
import { PainelHeader } from "../../../components/painelheader/PainelHeader";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../../contexts/AuthContext";
import { supabase } from "../../../services/supabaseClient";


import { v4 as uuidV4 } from 'uuid'


const schema = z.object({
  nameCar: z.string().nonempty("O campo nome do carro é obrigatorio"),
  marca: z.string().nonempty("O campo é obrigatorio"),
  year: z.string().nonempty("O campo é obrigatorio").regex(/^\d{4}$/, "O ano deve ter 4 dígitos"),
  km: z.string().nonempty("O campo é obrigatorio").regex(/^\d+$/, "A quilometragem deve conter apenas números"),
  value: z.string().nonempty("O campo é obrigatorio").regex(/^\d+(\.\d{2})?$/, "O valor deve ser um número"),
  city: z.string().nonempty("O campo é obrigatorio"),
  whatsapp: z.string().nonempty("O campo é obrigatorio").regex(/^\(\d{2}\)\d{4,5}-\d{4}$/, "WhatsApp inválido. Formato esperado: (99)99999-9999"),
  description: z.string().nonempty("O campo é obrigatorio"),
  cambio: z.string().nonempty("O campo é obrigatorio"),
  model: z.string().nonempty("O campo é obrigatorio")
})

type FormData = z.infer<typeof schema>

export interface ImageItemProps {
  userid: string,
  name: string,
  previewUrl: string,
  url: string,
  publicUrl: string
}


export function DashboardNew() {
  const { user } = useContext(AuthContext)
  const [image, setImage] = useState<ImageItemProps[]>([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  async function onSubmit(data: FormData) {
    if (image.length === 0) {
      alert('Nenhuma imagem foi enviada!')
      return
    }

    const imageJson = image.map(car => {
      return {
        userid: car.userid,
        name: car.name,
        url: car.url,
        publicUrl: car.publicUrl
      }
    })


    try {
      const { data: sa, error } = await supabase
        .from('cars')
        .insert([
          {
            name: data.nameCar,
            marca: data.marca,
            year: data.year,
            km: data.km,
            value: data.value,
            city: data.city,
            whatsapp: data.whatsapp,
            description: data.description,
            created_at: new Date(),
            images: imageJson,
            owner_name: user?.name,
            owner_id: user?.id,
            cambio: data.cambio,
            model: data.model
          }
        ])
        .select(); // importante para retornar os dados inseridos

      if (error) {
        console.log(error.message);
      } else {
        console.log(sa)
        reset()
        setImage([])
      }
    } catch (err) {
      console.log(err); // captura erros inesperados
    }
  }


  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === "image/jpeg" || image.type === "image/png") {
        //CADASTRAR NO BANCO DE DADOS
        await handleUpload(image)
      } else {
        alert("Insira um tipo de imagem valido!")
        return
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.id) {
      console.log("user nao encontradco")
      return
    }

    const currentId = user.id;
    const uidImage = uuidV4();

    const path = `${currentId}/${uidImage}`;

    const { data, error } = await supabase.storage.from("car_images").upload(path, image);

    if (error) {
      console.error("Erro no upload:", error.message);
    } else {
      const { data: {publicUrl} } = supabase.storage.from("car_images").getPublicUrl(path);

      const imageItem = {
        name: uidImage,
        userid: currentId,
        previewUrl: URL.createObjectURL(image),
        url: path,
        publicUrl
      };

      setImage(prev => [...prev, imageItem]);
      console.log("Upload feito com sucesso!", data);
    }
  }

  async function handleDelete(file: ImageItemProps) {
    if (!user?.id) {
      console.log("user nao enctonrado")
      return
    }

    // Usa exatamente o mesmo path usado no upload
    const path = file.url

    const { data, error } = await supabase.storage.from("car_images").remove([path]);

    if (error) {
      console.error("Erro ao excluir item:", error.message);
      return;
    }

    console.log("Imagem excluída com sucesso!", data);

    // Atualiza o state
    setImage(prev => prev.filter(img => img.name !== file.name));
  }


  return (

    <Container>
      <PainelHeader />
      <div className="w-full flex flex-col sm:flex-row  bg-white my-8 gap-2 p-3 rounded-lg">
        <button className="border-2 border-gray-600 rounded-lg w-48 flex items-center justify-center h-32">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>

          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile} />
          </div>
        </button>

        {image.map(item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <div className="absolute cursor-pointer">
              <FiTrash size={28} color="#fff" onClick={() => handleDelete(item)} />
            </div>
            <img
              src={item.previewUrl}
              alt="image-car"
              className="rounded-lg w-full h-32 object-cover" />
          </div>
        ))}
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
                <span>Modelo</span>
                <Input
                  placeholder="Ex: 2.0 16V Turbo Flex"
                  type="text"
                  name="model"
                  register={register}
                  error={errors.model?.message}
                />
              </div>

              <div className="w-1/2 flex flex-col">
                <label>Câmbio</label>
                <Input
                  placeholder="Ex: Manual"
                  type="text"
                  name="cambio"
                  register={register}
                  error={errors.cambio?.message}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-full flex flex-col">
                <span>Ano</span>
                <Input
                  placeholder="Ex: 2022"
                  type="text"
                  name="year"
                  register={register}
                  error={errors.year?.message}
                />
              </div>

              <div className="w-1/2 flex flex-col">
                <label>Km rodados</label>
                <Input
                  placeholder="Ex: 80.000"
                  type="text"
                  name="km"
                  register={register}
                  error={errors.km?.message}
                />
              </div>
            </div>

            <label>Valor em R$</label>
            <Input
              placeholder="Ex: 105.000"
              type="text"
              name="value"
              register={register}
              error={errors.value?.message}
            />

            <div className="flex gap-6">
              <div className="flex flex-col w-full">
                <label>Telefone / Whatsapp</label>
                <Input
                  placeholder="Ex: (31)9999-9999"
                  type="text"
                  name="whatsapp"
                  register={register}
                  error={errors.whatsapp?.message}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label>Cidade</label>
                <Input
                  placeholder="Ex: Ipatinga"
                  type="text"
                  name="city"
                  register={register}
                  error={errors.city?.message}
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