import BotCard from "@/src/components/BotCard";
import TuMeta from "@/src/components/TuMeta";
import TuSelect from "@/src/components/TuSelect";
import { SITE, api, symbols } from "@/src/utils/constants";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Input, Modal, Textarea } from "react-daisyui";

const tetsBots = [
    {
        name: "Bot 1",
        desc: "Does what bot 1 does hommie. The hell!",
        ccy: "USDT",
        base: "BTC",
        id: "ssddaw",
    },
    {
        name: "Bot 2",
        desc: "Does what bot 2 does hommie. The hell!",
        ccy: "USDT",
        base: "ETH",
        id: "ssddaw",
    },
    {
        name: "Bot 3",
        desc: "Does what bot 3 does hommie. The hell!",
        ccy: "USDT",
        base: "SOL",
        id: "ssddaw",
    },
    {
        name: "Bot 4",
        desc: "Does what bot 4 does hommie. The hell!",
        ccy: "USDT",
        base: "XRP",
        id: "ssddaw",
    },
    {
        name: "Bot 5",
        desc: "Does what bot 5 does hommie. The hell!",
        ccy: "USDT",
        base: "DODGE",
        id: "ssddaw",
    },
    {
        name: "Bot 6",
        desc: "Does what bot 6 does hommie. The hell!",
        ccy: "USDT",
        base: "BTP",
        id: "ssddaw",
    },
];

export default function UserBotsPage() {
    
    const [strategies, setStrategies] = useState<any[]>([])
    const router = useRouter();
    const newBotModalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {}, []);

    const getStrategies = async () => { 
        try{
            console.log('Getting strategies...');
        const res = await api().get('/strategies')
        setStrategies(res.data);
        }
        catch(err){
            console.log(err);
        }
     }
    return (
        <>
            <TuMeta title={`${router.query.username}'s bots - ${SITE}`} />
            <div className="p-5">
                <h1 className="text-xl text-gray-200">My bots</h1>
                <div className="mt-5">
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                        {tetsBots.map((e, i) => (
                            <BotCard bot={e} key={`item-${i * 1}`} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={async (_) => {
                        await getStrategies()
                        newBotModalRef.current?.showModal();
                    }}
                    className="btn btn-md btn-primary btn-circle fab"
                >
                    <i className="fi fi-rr-plus"></i>
                </button>
                <Modal ref={newBotModalRef}>
                    <Modal.Header className="font-bold">New bot</Modal.Header>
                    <Modal.Body>
                        <form action="">
                            <div className="grid sm:grid-cols-2 gap-3 items-end">
                                <div className="form-group">
                                    <label htmlFor="name" className="label">
                                        <span className="label-text">
                                            Bot name
                                        </span>
                                    </label>
                                    <Input
                                        placeholder="Enter bot name..."
                                        required
                                        id="name"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <TuSelect
                                        placeholder="Pair"
                                        options={symbols.map((e) => ({
                                            label: e.join("/"),
                                            value: e,
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 items-end mt-3">
                            
                                
                                <div className="form-group">
                                    <TuSelect
                                        placeholder="Interval"
                                        options={[5, 15, 30, 60].map((e) => ({
                                            label: `${e}m`,
                                            value: e,
                                        }))}
                                        
                                    />
                                </div>
                                <div className="form-group">
                                    <TuSelect
                                        placeholder="Strategy"
                                        options={strategies.map((e, i) => ({
                                            label: e.name,
                                            value: i + 1,
                                        }))}
                                        
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="desc" className="label">
                                    Description (optional)
                                </label>
                                <Textarea
                                    id="desc"
                                    placeholder="Write short description for your bot..."
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <Button className="w-100p" color="primary">Create bot</Button>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Actions>
                        <form method="dialog">
                            <Button>Close</Button>
                        </form>
                    </Modal.Actions>
                </Modal>
            </div>
        </>
    );
}
