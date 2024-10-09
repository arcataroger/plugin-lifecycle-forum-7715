import {connect, IntentCtx, ItemType, RenderItemFormOutletCtx} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen, {PluginConfig} from "./entrypoints/ConfigScreen";
import {render} from "./utils/render";
import {FormOutlet} from "./components/FormOutlet.tsx";

connect({
    renderConfigScreen(ctx) {
        return render(<ConfigScreen ctx={ctx}/>);
    },
    itemFormOutlets(itemType: ItemType, ctx: IntentCtx) {
        // Get the list of model api keys configured on the plugin extension page
        const {modelApiKeys} = ctx.plugin.attributes.parameters as PluginConfig;
        const modelApiKeysArray = Array.isArray(modelApiKeys) ? modelApiKeys : [];

        // Check if this model is enabled for this plugin
        const modelIsEnabled = modelApiKeysArray
            .map((model) => model.value)
            .includes(itemType.attributes.api_key);

        // Debug
        console.debug(
            `Checking ${itemType.attributes.api_key} for Item Form Outlet - Enabled: ${modelIsEnabled}`
        );

        if (modelIsEnabled) {
            console.info(
                `Rendering Item Form Outlet for ${itemType.attributes.api_key}`
            ); // This is logged one time
            return [
                {
                    id: "global_dynamic_computed_fields",
                    initialHeight: 0,
                },
            ];
        } else {
            return [];
        }
    },
    renderItemFormOutlet(outletId: string, ctx: RenderItemFormOutletCtx) {
        switch (outletId) {
            case "global_dynamic_computed_fields":
                console.debug(`Rendering Form Outlet: ${outletId}`); // This is logged multiple times, but not each time the form loads
                return render(<FormOutlet ctx={ctx}/>)
        }
    },
});
