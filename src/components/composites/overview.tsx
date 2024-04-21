"use client"
import { formatRupiah } from '@/utils/common'
import { ResponsiveLine } from '@nivo/line'
import { useState, useEffect } from 'react'
interface IOverview {
  data: any
}
export const Overview = ({ data }: IOverview) => {

  const [datasets, setDatasets] = useState([])

  useEffect(() => {
    let animation = setTimeout(() => setDatasets(data), 1)
    return () => {
      clearTimeout(animation);
    };
  }, [data]);

  return (
    <>
      {datasets ?
        <ResponsiveLine
          data={datasets}
          curve='linear'
          enableArea
          areaOpacity={.1}
          areaBaselineValue={0}
          areaBlendMode='multiply'
          colors={{ datum: 'color' }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          enableSlices={"x"}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
          }}
          yFormat={(value) => `${formatRupiah(value as any)}`}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'IDR',
            format: (value) => `Rp ${formatRupiah(value)}`,
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          enableGridX
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
        : "Loading.."}

    </>
  )
}
