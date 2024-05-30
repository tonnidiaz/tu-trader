import TuMeta from "@/src/components/TuMeta";
import { SITE, api } from "@/src/utils/constants";
import { IObj } from "@/src/utils/interfaces";
import Error from "next/error";
import { FC } from "react";
import { Stats } from "react-daisyui";
import { JSONTree } from "react-json-tree";

interface IProps {
    bot: IObj;
    err?: IObj;
}
const theme = {
    scheme: "monokai",
    author: "Tonni Diaz",
    base00: "#1d232a",
    base01: "#383830",
    base02: "#49483e",
    base03: "#75715e",
    base04: "#a59f85",
    base05: "#f8f8f2",
    base06: "#f5f4f1",
    base07: "#f9f8f5",
    base08: "#f92672",
    base09: "#fd971f",
    base0A: "#f4bf75",
    base0B: "#a6e22e",
    base0C: "#a1efe4",
    base0D: "#66d9ef",
    base0E: "#ae81ff",
    base0F: "#cc6633",
};
export const getServerSideProps = async ({ query }: { query: IObj }) => {
    try {
        const res = await api().get("/bots/" + query.id);

        return { props: { bot: res.data } };
    } catch (e: any) {
        console.log(e);
        const code = e.response?.status ?? 500;
        const _err =
            typeof e.response?.data == "string" &&
            e.response?.data?.startsWith("tuned:")
                ? e.response.data.replace("tuned:", "")
                : "Something went wrong";
        return { props: { err: { code, msg: _err } } };
    }
};

const testOrders = [
    { name: "Order 1", filed: false },
    { name: "Order 2", filed: false },
    { name: "Order 3", filed: true },
    { name: "Order 4", filed: false },
];
const BotPage: FC<IProps> = ({ bot, err }) => {
    return err ? (
        <Error statusCode={err.code} title={err.msg} />
    ) : (
        <div className="p-5">
            <TuMeta title={`Bot: ${bot.name} - ${SITE}`} />

            <fieldset className="formset border-card border-1 p-4">
                <legend>
                    <h1 className="text-gray-200">{bot.name}</h1>
                </legend>
                <div className="flex gap-4 justify-center">
                    <span className="fw-8">
                        {bot.base}/{bot.ccy}
                    </span>{" "}
                    {bot.active ? (
                        <div className="badge badge-success">Active</div>
                    ) : (
                        <div className="badge badge-warning">Paused</div>
                    )}
                </div>
                <div className="mt-2">
                    <div className="stats text-center flex">
                        <div className="stat m-auto">
                            <span className="stat-title">Total orders:</span>
                            <span className="stat-value">
                                {testOrders.length}
                            </span>
                        </div>
                    </div>
                    <fieldset className="formset border-1 border-card  p-2 mt-2">
                        <legend>Orders</legend>
                        <div className="mt-2 overflow-y-scroll">
                            {testOrders.map((el, i) => (
                                <div key={`item-${i * 1}`}>
                                    <JSONTree
                                        theme={theme}
                                        keyPath={["Orders"]}
                                        data={el}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </fieldset>
        </div>
    );
};

export default BotPage;
