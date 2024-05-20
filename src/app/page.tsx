import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
<div className="w-100p h-100p flex justify-center">
    <div className="min-h-100p relative h-100p w-70p bg-100 pd-10 justify-center items-center flex flex-col">
            <div id="display" className="br-10 flex items-center justify-center">
                <div className="rounded-full bg-dark w-200px h-200px border-4 flex flex-col items-center justify-center">
                    <p>Starting in</p>
                    <p className="text-primary">10s</p>
                </div>
            </div>

            <div className="my-4 p-4 flex items-center justify-around w-100p">
                    <div className="">
                        <div className="mb-4">
                            {/* <TuField label="Stake:" type="number"/>
                            <TuField label="Cashout:" type="number"/> */}
                        </div>
                        <button type='button' className="btn btn-secondary bet-btn button">Bet now</button>
                    </div>
                    <div className="">
                        <div className="mb-4">
                            {/* <TuField label="Stake:" type="number"/>
                            <TuField label="Cashout:" type="number"/> */}
                        </div>
                        <button className="btn btn-secondary bet-btn">Bet now</button>
                    </div>
            </div>
        </div>
</div>
    </main>
  )
}
