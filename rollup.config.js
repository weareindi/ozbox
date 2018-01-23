import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: '_src/js/script.js',
    output: {
        file: 'app/script.js',
        format: 'iife'
    },
    plugins: [
        resolve(),
        babel({
            presets: [
                'es2015-rollup'
            ]
        })
    ]
};
