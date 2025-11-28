const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf).oneOf;

      // SCSS 룰 확인
      const scssRules = oneOfRule.filter(rule =>
        rule.test && (rule.test.toString().includes('scss') || rule.test.toString().includes('sass'))
      );

      // Rule #7, #8을 찾아서 tiptap만 별도 처리
      scssRules.forEach(rule => {
        rule.oneOf = rule.oneOf || []; // safety
        // tiptap-ui SCSS만 따로 처리
        const tiptapRule = {
          test: /tiptap-ui[\\/].*\.scss$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: { sourceMap: true },
            },
            {
              loader: require.resolve('resolve-url-loader'),
              options: {
                sourceMap: true,
                root: path.resolve(__dirname, 'src'),
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: { sourceMap: true },
            },
          ],
        };

        // SCSS 룰 제일 앞에 삽입
        oneOfRule.unshift(tiptapRule);
      });

      return webpackConfig;
    },
  },
};
