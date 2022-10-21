// 1st api
// https://api.thegraph.com/subgraphs/name/graphitetools/tokensets
// 2nd api
//https://api.coingecko.com/api/v3/coins/ethereum/contract/--address--

import { ethers, utils } from "ethers";
import { useEffect, useState } from "react";

function App() {
  const [FirstData, setFirstData] = useState([]); //Fetches first api (Graphql)
  // const [MktFilter, setMktFilter] = useState(null); //Used to filter marketcap

  const randomMarketPrice = 357; //Random price since 2nd API wasnt available
  const provider = new ethers.providers.EtherscanProvider(); //Provider fetched from ether.js

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
    setFirstData(receivedData); //Setting the data in to stateArray to use it globally
    //Mapping through the received data -> components-> Id[0] and sending it to ether.js
    receivedData.map(async (e) => {
      const gasPrice = await provider.getGasPrice(e.components[0]); //Getting gas price
      const gasPriceFormatter = utils.formatUnits(gasPrice, "gwei"); //Using ether.js format utility to display gas price properly
      console.log("gasprice: ", gasPriceFormatter);

      const balance = await provider.getBalance(e.components[0]); //Getting balance of the contract
      const showBalance = ethers.utils.formatEther(balance);
      console.log("balance: ", showBalance);

      //GetAvatar would always return null. So used custom Image as a thumbnail.
    });
    //2nd API Code
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
    return;
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
              <td className=" text-center">{e.units[0] * randomMarketPrice}</td>
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
      <p>
        Check the console in order to check the data that is coming from
        ether.js. (Gas Price and Balance).
        <br /> getAvatar() function would return null so, applied custom image
        as a thumbnail.
        <br />
        Couldn't find any assets under the component's address, thus they are
        not mentioned here.
        <br />
        You may increase the first:count in query in code, in order to fetch
        more records.
      </p>
    </div>
  );
}
export default App;
