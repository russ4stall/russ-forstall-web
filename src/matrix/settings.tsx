import { ChangeEvent, ChangeEventHandler } from "react";

export type MatrixSettings = {
    xAxisLabel: string;
    yAxisLabel: string;
    labelOne: string;
    labelTwo: string;
    labelThree: string;
    labelFour: string;
    itemColor: string;
}

export const settingsTemplates = {
    geoghagen: {
        xAxisLabel: 'Passion',
        yAxisLabel: 'Skill',
        labelOne: 'Do',
        labelTwo: 'Teach',
        labelThree: 'Delegate',
        labelFour: 'Learn'
    } as MatrixSettings,
    eisenhower: {
        xAxisLabel: 'Urgency',
        yAxisLabel: 'Importance',
        labelOne: 'Do now',
        labelTwo: 'Schedule',
        labelThree: 'Delete',
        labelFour: 'Delegate'
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
                            <option value="geoghagen">Geoghagen Matrix</option>
                            <option value="eisenhower">Eisenhower Matrix</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>X Axis:</td>
                    <td><input type="text" name='xAxisLabel' value={settings.xAxisLabel} onChange={(e) => setSettings({ ...settings, xAxisLabel: e.target.value }) }/></td>
                </tr>
                <tr>
                    <td>Y Axis:</td>
                    <td><input type="text" name='yAxisLabel' value={settings.yAxisLabel} onChange={(e) => setSettings({ ...settings, yAxisLabel: e.target.value }) }/></td>
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