import React from "react";

import { Doughnut } from 'react-chartjs-2'

function PieData({ transDetails }) {

  const labels = []
  const data = []

  transDetails && Object.entries(transDetails?.category)?.forEach(cat => {
    let title = cat[0]
    let details = cat[1]

    labels.push(title.toUpperCase())
    data.push(details.money_total)


  })


  return (
    <div>
      <Doughnut
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Balance',
              data: data,
              backgroundColor: [
                '#00ffb3',
                '#00e6d9',
                '#00ccff',
                '#008cff',
                '#004cff',
                "#671af4",
              ],
              hoverOffset: 10
            },
          ],
        }}
        height={400}
        width={500}
        options={{
          maintainAspectRatio: false,
          legend: {
            labels: {
              fontSize: 50,
            },
          },
        }}
      />
    </div>
  )
}

export default PieData
