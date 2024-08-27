import { ResponsivePie } from '@nivo/pie'
import { useEffect, useState } from 'react'

interface IPieChartSpent {
    data: any
}
const PieChartSpent = ({ data }: IPieChartSpent) => {

    const [dataPie, setDataPie] = useState([])

    useEffect(() => {
        let animation = setTimeout(() => setDataPie(data), 1)
        return () => {
            clearTimeout(animation);
        };
    }, [data]);

    return (
        <>
            {dataPie ?
                <ResponsivePie
                    data={dataPie}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.7}
                    padAngle={2}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'blue_green' }}
                    borderWidth={1}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.2
                            ]
                        ]
                    }}
                    arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsTextColor={{ theme: 'background' }}
                    motionConfig="slow"
                    transitionMode='startAngle'
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
                : "Loading..."}
        </>

    )

}


export default PieChartSpent;