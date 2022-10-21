// 1st api
// https://api.thegraph.com/subgraphs/name/graphitetools/tokensets
// 2nd api
//https://api.coingecko.com/api/v3/coins/ethereum/contract/--address--

import { ethers, utils } from "ethers";
import { useEffect, useState } from "react";

function App() {
  const [FirstData, setFirstData] = useState([]);
  const [MktFilter, setMktFilter] = useState(null);
  // const [stateBalance, stateSetBalance] = useState([]);
  const randomMarketPrice = 357;
  const provider = new ethers.providers.EtherscanProvider();

  useEffect(() => {
    request();
  }, []);
  const request = async () => {
    let fetching = await fetch(
      "https://api.thegraph.com/subgraphs/name/graphitetools/tokensets",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query:
            "query MyQuery{sets(first:5, orderBy:supply, skip:0){id address name symbol units components}}",
        }),
      }
    );
    const res = await fetching.json();
    const receivedData = res.data.sets;
    setFirstData(receivedData);
    receivedData.map(async (e) => {
      const gasPrice = await provider.getGasPrice(e.components[0]);
      const gasPriceFormatter = utils.formatUnits(gasPrice, "gwei");
      console.log("gasPrice", gasPriceFormatter);
      const balance = await provider.getBalance(e.components[0]);
      const showBalance = ethers.utils.formatEther(balance);
      console.log("balance", showBalance);
    });

    // receivedData.map(async (e) => {
    //   try {
    //     const res2req = await fetch(
    //       `https://api.coingecko.com/api/v3/coins/ethereum/contract/0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec`
    //     );
    //     setSecondData(res2req);
    //   } catch (err) {
    //     console.log("Not available" + err);
    //   }
    // });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Market Cap</th>
            <th>Price(Statically Set)</th>
          </tr>
        </thead>
        <tbody>
          {FirstData.map((e) => (
            <tr>
              <td className="flex items-center border ">
                <span>
                  <img src="/eth.png" width={55} height={15} alt="img here" />
                </span>

                <span>{e.name}</span>
              </td>
              <td className=" text-center">
                {[e.units[0] * randomMarketPrice]}
              </td>
              <td className=" text-center"> {randomMarketPrice}</td>
            </tr>
          ))}
          {/* {MktFilter === "lowestFirst"
            ? FirstData.map(({ units: [firstUnit] }) => (
                <tr>
                  <td>{firstUnit * randomMarketPrice}</td>
                </tr>
              )).sort((a, b) => a - b)
            : FirstData.map(({ units: [firstUnit] }) => (
                <tr>
                  <td>{firstUnit * randomMarketPrice}</td>
             
              ))
                .sort((a, b) => a - b)
                .reverse()}
          {FirstData.map(() => (
            <tr>
              <td>{randomMarketPrice}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
export default App;
