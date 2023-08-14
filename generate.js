/* 
 * TextMate rule Names for tree-sitter-rules
 */
const tmRuleName = {
	string: "string.quoted.single.vhs",
	comment: "comment.line.number-sign.vhs",
};

/*
 * Utility functions to define 
 */
const treeSitterUtils = {
	grammar  : (config) => createTextMateGrammer(config),
	repeat1  : (...args) => console.log('repeat1'),
	choice   : (...args) => console.log('choice'),
	seq      : (...args) => console.log('seq'),
	optional : (...args) => console.log('optional'),
	repeat   : (...args) => console.log('repeat'),
};

/*
 * Make treeSitterUtils available in global scope
 */
function hoistTreeSitterUtils () {
	for (let utility in treeSitterUtils) {
		global[utility] =  treeSitterUtils[utility];
	}
}

/*
 * Driver function
 */
(function main () {

	/*
   * Make sure all utilities are available 
   * in global scope before actual grammerConfig
   * is imported
   */
	hoistTreeSitterUtils();

	/* 
  * Manually importing this for now, later
  * this can be passed an argument to script
  * Note: grammer.js exports the output for grammar
  * hence console.log of grammer function arguments
  * is expected
  */
	const grammerConfig = require ('./tree-sitter-vhs/grammar.js');
	console.debug(JSON.stringify(grammerConfig, null, 2));
	console.debug('grammerConfig loaded successfully');
})();


/*
 * Refer: 
 * TreeSitter Grammar: https://tree-sitter.github.io/tree-sitter/creating-parsers#the-grammar-dsl
 * TextMate Grammer: https://macromates.com/manual/en/language_grammars
 */
function createTextMateGrammer (config) {
	const $schema =  "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json";
	const rootRuleName = 'program';
	const { name, rules } = config;
	let repository = {};
	let patterns = [{ include: `#${rootRuleName}`}];

	let $ = symbols = {};

	Object.keys(rules).forEach((ruleName) => {
		$[ruleName] = rules[ruleName];
	});

	/* Traverse all the rules from rootRule */
	Object.keys(rules).forEach(ruleName => {
		const processedRule = rules[ruleName]($);
		let tmRule;

		/*
		 * TODO: convert js RegExp to Ruby compatible Regex for TextMate
		 */
		if (processedRule instanceof RegExp) {
			tmRule = {
				name: tmRuleName[ruleName],
				pattern: processedRule.toString(),
			}
		} else {
			tmRule = "TODO";
		}

		repository[ruleName] = tmRule;
	});

	const tmGrammer = {
		$schema,
		name,
		patterns,
		repository,
	};

	return tmGrammer;
}
