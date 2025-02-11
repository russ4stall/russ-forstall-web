import { ChangeEvent, ChangeEventHandler } from "react";

export type MatrixSettings = {
    xAxisLabelLeft: string;
    xAxisLabelRight: string;
    yAxisLabelBottom: string;
    yAxisLabelTop: string;
    labelOne: string;
    labelTwo: string;
    labelThree: string;
    labelFour: string;
    itemColor: string;
}

export const settingsTemplates = {
    geoghagen: {
        xAxisLabelLeft: 'Not Passionate',
        yAxisLabelBottom: 'Not Skilled',
        xAxisLabelRight: 'Passionate',
        yAxisLabelTop: 'Skilled',
        labelOne: 'Do',
        labelTwo: 'Teach',
        labelThree: 'Delegate',
        labelFour: 'Learn'
    } as MatrixSettings,
    eisenhower: {
        xAxisLabelLeft: 'Urgent',
        xAxisLabelRight: 'Not Urgent',
        yAxisLabelTop: 'Important',
        yAxisLabelBottom: 'Not Important',
        labelOne: 'Schedule',
        labelTwo: 'Do now',
        labelThree: 'Delegate',
        labelFour: 'Eliminate'
    } as MatrixSettings,
    swot: {
        xAxisLabelLeft: 'Helpful',
        xAxisLabelRight: 'Harmful',
        yAxisLabelTop: 'Internal',
        yAxisLabelBottom: 'External',
        labelOne: 'Weaknesses',
        labelTwo: 'Strengths',
        labelThree: 'Opportunities',
        labelFour: 'Threats'
    } as MatrixSettings,
    johari: {
        xAxisLabelLeft: 'Known to self',
        xAxisLabelRight: 'Not known to self',
        yAxisLabelTop: 'Known to others',
        yAxisLabelBottom: 'Not known to others',
        labelOne: 'Blindspot',
        labelTwo: 'Open',
        labelThree: 'Hidden',
        labelFour: 'Unknown',
        itemColor: '#FA8072'
    } as MatrixSettings
};

type SettingsFormParams = {
    settings: MatrixSettings;
    setSettings: any;
    onMouseEnter: any; 
    onMouseLeave: any;
}

export function SettingsForm({ settings, setSettings, onMouseEnter, onMouseLeave }: SettingsFormParams) {

    const handleTemplateSelection = (e: any) => {
        const templateKey = e.target.value as string;
        //@ts-ignore
        setSettings({...settings, ...settingsTemplates[e.target.value]})
    }

    return (
        <>
            <table id="settings-form" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
                <tbody>
                <tr>
                    <td>Templates:</td>
                    <td>
                        <select name="template" onChange={handleTemplateSelection} >
                            <option value="eisenhower">Eisenhower Matrix</option>
                            <option value="geoghagen">Unique Abilities Matrix</option>
                            <option value="swot">SWOT Analysis</option>
                            <option value="johari">Johari Window</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>X Axis Left:</td>
                    <td><input type="text" name='xAxisLabelLeft' value={settings.xAxisLabelLeft} onChange={(e) => setSettings({ ...settings, xAxisLabelLeft: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>X Axis Right:</td>
                    <td><input type="text" name='xAxisLabelRight' value={settings.xAxisLabelRight} onChange={(e) => setSettings({ ...settings, xAxisLabelRight: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Y Axis Top:</td>
                    <td><input type="text" name='yAxisLabelTop' value={settings.yAxisLabelTop} onChange={(e) => setSettings({ ...settings, yAxisLabelTop: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Y Axis Bottom:</td>
                    <td><input type="text" name='yAxisLabelBottom' value={settings.yAxisLabelBottom} onChange={(e) => setSettings({ ...settings, yAxisLabelBottom: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Quadrant One:</td>
                    <td><input type="text" name='labelOne' value={settings.labelOne} onChange={(e) => setSettings({ ...settings, labelOne: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Quadrant Two:</td>
                    <td><input type="text" name='labelOne' value={settings.labelTwo} onChange={(e) => setSettings({ ...settings, labelTwo: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Quadrant Three:</td>
                    <td><input type="text" name='labelOne' value={settings.labelThree} onChange={(e) => setSettings({ ...settings, labelThree: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Quadrant Four:</td>
                    <td><input type="text" name='labelOne' value={settings.labelFour} onChange={(e) => setSettings({ ...settings, labelFour: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Item Color:</td>
                    <td><input type="color" name='itemColor' defaultValue='#FA8072' value={settings.itemColor} onChange={(e) => setSettings({ ...settings, itemColor: e.target.value }) }/></td>
                </tr>
                </tbody>
            </table>
        </>
    );
}