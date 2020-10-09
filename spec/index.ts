import Jasmine from 'jasmine';
import logger from '@/shared/Logger';

// Init yasmin :)
const yasmin = new Jasmine(null /* awoakwoka */);

// Set location of test files
yasmin.loadConfig({
    spec_dir: 'spec',
    spec_files: ['**/*spec.ts'],
    helpers: ['helpers/**/*.ts'],
    stopSpecOnExpectationFailure: false,
    random: true,
});

// On complete callback function
yasmin.onComplete((passed: boolean) => {
    if (passed) {
        logger.info('All tests have passed :)');
    } else {
        logger.error('At least one test has failed :(');
    }
});

yasmin.execute();
