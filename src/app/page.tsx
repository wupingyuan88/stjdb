'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Hand, HandMetal, HandScissors, History, RefreshCcw } from 'lucide-react'

const options = [
	{ label: '剪刀', value: 'scissors', icon: <HandScissors className="w-5 h-5 mr-1" /> },
	{ label: '石头', value: 'rock', icon: <HandMetal className="w-5 h-5 mr-1" /> },
	{ label: '布', value: 'paper', icon: <Hand className="w-5 h-5 mr-1" /> },
] as const

type OptionValue = typeof options[number]['value']
type Result = '你赢了！' | '你输了！' | '平局' | ''
interface HistoryItem {
	user: OptionValue
	computer: OptionValue
	res: Result
}

function getResult(user: OptionValue, computer: OptionValue): Result {
	if (user === computer) return '平局'
	if (
		(user === 'scissors' && computer === 'paper') ||
		(user === 'rock' && computer === 'scissors') ||
		(user === 'paper' && computer === 'rock')
	) {
		return '你赢了！'
	}
	return '你输了！'
}

export default function Home() {
	const [userPick, setUserPick] = useState<OptionValue | null>(null)
	const [computerPick, setComputerPick] = useState<OptionValue | null>(null)
	const [result, setResult] = useState<Result>('')
	const [history, setHistory] = useState<HistoryItem[]>([])

	const handlePick = (pick: OptionValue) => {
		const computer = options[Math.floor(Math.random() * 3)].value as OptionValue
		setUserPick(pick)
		setComputerPick(computer)
		const res = getResult(pick, computer)
		setResult(res)
		setHistory([{ user: pick, computer, res }, ...history.slice(0, 9)])
		toast(res)
	}

	const handleReset = () => {
		setUserPick(null)
		setComputerPick(null)
		setResult('')
		setHistory([])
		toast.success('已重置')
	}

	const getLabel = (val: OptionValue | null) => options.find(o => o.value === val)?.label || ''
	const getIcon = (val: OptionValue | null) => options.find(o => o.value === val)?.icon || null

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
			<div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-6">
				<h1 className="text-2xl font-bold text-center mb-2">剪刀石头布小游戏</h1>
				<div className="flex justify-center gap-4 mb-4">
					{options.map(opt => (
						<Button key={opt.value} onClick={() => handlePick(opt.value)} variant="outline" size="lg">
							{opt.icon}{opt.label}
						</Button>
					))}
				</div>
				<div className="flex justify-between items-center mb-2">
					<div>
						<span className="font-semibold">你：</span>
						{userPick ? <span className="inline-flex items-center">{getIcon(userPick)}{getLabel(userPick)}</span> : '未出'}
					</div>
					<div>
						<span className="font-semibold">电脑：</span>
						{computerPick ? <span className="inline-flex items-center">{getIcon(computerPick)}{getLabel(computerPick)}</span> : '未出'}
					</div>
				</div>
				<div className="text-center text-lg font-medium min-h-[28px]">
					{result && <span>{result}</span>}
				</div>
				<div className="flex justify-between items-center mt-4">
					<div className="flex items-center text-gray-500"><History className="w-4 h-4 mr-1" />历史记录</div>
					<Button onClick={handleReset} size="sm" variant="ghost"><RefreshCcw className="w-4 h-4 mr-1" />重置</Button>
				</div>
				<ul className="mt-2 max-h-40 overflow-y-auto text-sm">
					{history.length === 0 && <li className="text-gray-400 text-center">暂无记录</li>}
					{history.map((item, idx) => (
						<li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
							<span className="inline-flex items-center">你: {getIcon(item.user)}{getLabel(item.user)}</span>
							<span className="inline-flex items-center">电脑: {getIcon(item.computer)}{getLabel(item.computer)}</span>
							<span>{item.res}</span>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
