import copy from "rollup-plugin-copy";

export default args => {
    const result = args.configDefaultConfig;
    return result.map((config, index) => {
        if (index === 0) {
            const plugins = config.plugins || []
            config.plugins = [
                ...plugins,
                copy({
                    targets: [{ src: "node_modules/onnxruntime-web/dist/*.wasm", dest: "dist/tmp/widgets" }]
                }),
            ]   
            
            const external = config.external || []
            config.external = [
                ...external,
                'fs',
                
            ]
        }
        return config;
    });
};
