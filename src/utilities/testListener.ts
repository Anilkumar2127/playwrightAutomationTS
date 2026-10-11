import { FullConfig, Reporter, Suite, TestCase, TestResult, TestStep } from "@playwright/test/reporter";
import { logger } from "../utilities/logger";
import { Page } from "@playwright/test";


export class TestListener implements Reporter {
    public page!: Page;
    public testStart = "#################################### TEST STARTED #########################################";
    public testEnd = "#################################### TEST ENDED #########################################";
    public stepStart = "------------------------------------ STEP STARTED ------------------------------------------";
    public stepEnd = "------------------------------------ STEP ENDED --------------------------------------------";
    private stepCount: number = 0;

    public async onTestBegin(test: TestCase, result: TestResult): Promise<void> {
        this.stepCount = 0;
        logger.info(this.testStart);
        logger.info(`${test.title}`);
    }

    public async onStepBegin(test: TestCase, result: TestResult, step: TestStep): Promise<void> {
        // Only log top-level steps (steps without parent)
        if (step.category === 'test.step' ) {
            this.stepCount++;
            logger.info(this.stepStart)
            logger.info(`Step ${this.stepCount}: ${step.title}`);
        }
    }

    public async onStepEnd(test: TestCase, result: TestResult, step: TestStep): Promise<void> {
        // Only log step end for top-level steps (steps without parent)
        if (step.category === 'test.step') {
            
            logger.info(this.stepEnd);
        }
    }

    public async onTestEnd(test: TestCase, testresult: TestResult): Promise<void> {
        if (testresult.status === 'passed') {
            logger.info(`Test Status: PASSED`);
        }
        else if (testresult.status === 'failed') {
            logger.error(`Test Status: FAILED and error trace:${testresult.error?.stack}`);
        }
        else if (testresult.status === 'skipped') {
            logger.info(`Test Status: SKIPPED`);
        }
        else if (testresult.status === 'timedOut') {
            logger.error(`Test Status: TIMED OUT`);
        }
        logger.info(this.testEnd);
    }
}

export default TestListener;
