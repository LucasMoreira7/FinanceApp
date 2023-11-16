//import './styles/global.css';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';

//import './App.css'

const createCardPurchasesSchema = z.object({
  purchasePrice: z
    .string()
    .transform((value) => {
      // Remove caracteres não numéricos (exceto ponto e vírgula)
      return value.replace(/[^0-9,.]/g, '');
    })
    .refine((value) => {
      // Verifique se o valor é um número válido
      return !isNaN(parseFloat(value));
    }, {
      message: 'O preço deve ser um número válido',
    }),
  //purchasePrice: z.string().nonempty({
  //  message: 'O preço é obrigatório',
  //}),
  installments: z.number().min(1, {
    message: 'O número de parcelas deve ser no mínimo 1'
  }).max(99, {
    message: 'O número de parcelas deve ser no máximo 99'
  }),
  date: z.coerce.date(),
  category: z.string(),
  description: z.string(),
  userId: z.string(),
  associatedUserId: z.string(),
  cardId: z.string()
})

type CreateCardPurchasesData = z.infer<typeof createCardPurchasesSchema>

export default function App() {
  const [output, setOutput] = useState('')
  const [amount, setAmount] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCardPurchasesData>({
    resolver: zodResolver(createCardPurchasesSchema),
  })

  function createUser(data: CreateCardPurchasesData) {
    setOutput(JSON.stringify(data))
  }
// inicio currency
  const formatCurrency = (value) => {
    // Formate o valor como moeda (por exemplo, 1.000,00)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setAmount(formattedValue);
  };
//fim currency
  return (
  <main className='h-screen bg-zinc-700  flex flex-col gap-6 items-center justify-center'>
      <form 
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="purchasePrice"
            className="text-sm text-white"
          >
            Preço
          </label>
          <input 
            type="text"
            value={amount}
            id="purchasePrice" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            //{...register('purchasePrice')},
            onChange={handlePriceChange}
          />
          {errors.purchasePrice && <span className="text-xs text-red-500">{errors.purchasePrice.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="installments"
            className="text-sm text-white"
          >
            Parcelas
          </label>
          <input 
            type="number"
            {...register("installments", {
              min: 1,
              max: 99
            })}
            id="installments" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('installments', {valueAsNumber: true})} 
          />
          {errors.installments && <span className="text-xs text-red-500">{errors.installments.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="date"
            className="text-sm text-white"
          >
            Data
          </label>
          <input 
            type="date" 
            id="date" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('date')} 
          />
          {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="category"
            className="text-sm text-white"
          >
            Categoria
          </label>
          <input 
            type="text" 
            id="category" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('category')} 
          />
          {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="description"
            className="text-sm text-white"
          >
            Descrição
          </label>
          <input 
            type="text" 
            id="description" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('description')} 
          />
          {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="userId"
            className="text-sm text-white"
          >
            Usuário
          </label>
          <input 
            type="text" 
            id="userId" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('userId')} 
          />
          {errors.userId && <span className="text-xs text-red-500">{errors.userId.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="associatedUserId"
            className="text-sm text-white"
          >
            Usuário associado
          </label>
          <input 
            type="text" 
            id="associatedUserId" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('associatedUserId')} 
          />
          {errors.associatedUserId && <span className="text-xs text-red-500">{errors.associatedUserId.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label 
            htmlFor="cardId"
            className="text-sm text-white"
          >
            Cartão
          </label>
          <input 
            type="text" 
            id="cardId" 
            className="rounded border border-zinc-300 shadow-sm px-3 py-1 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            {...register('cardId')} 
          />
          {errors.cardId && <span className="text-xs text-red-500">{errors.cardId.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-violet-500 text-white rounded px-3 py-2 font-semibold text-sm hover:bg-violet-600"
        >
          Salvar
        </button>
      </form>

      <pre className="text-sm">
        {output}
      </pre>
    </main>
  )
}

//export default App