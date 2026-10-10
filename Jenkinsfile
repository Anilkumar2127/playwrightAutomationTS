// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline
// Playwright TypeScript Framework
// Anil Automation
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
        maven 'Maven-3.9'
        jdk 'JDK-17'
        allure 'Allure'
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['preprod','nonprod'],
            description: 'Select environment to run tests'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['apiCalls','uitests'],
            description: 'Select test suite'
        )
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        // ═════════════════════════════════════════════════
        // STAGE 1: BUILD APP + UNIT TESTS
        // ═════════════════════════════════════════════════
        stage('Build & Unit Tests') {
            steps {
                echo "========================================="
                echo "  Building App + Running Unit Tests"
                echo "========================================="
                dir('dev-app') {
                    git url: 'https://github.com/jglick/simple-maven-project-with-tests.git',
                        branch: 'master'
                    sh 'mvn clean install -Dmaven.test.failure.ignore=true'
                }
            }
            post {
                always {
                    junit 'dev-app/target/surefire-reports/*.xml'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 2: INSTALL PLAYWRIGHT DEPENDENCIES
        // ═════════════════════════════════════════════════
        stage('Install Dependencies') {
            steps {
                echo "========================================="
                echo "  Installing Playwright Dependencies"
                echo "========================================="
                dir('qa-tests') {
                    git url: 'https://github.com/Anilkumar2127/playwrightAutomationTS',
                        branch: 'main'
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 3: DEPLOY DEV + SANITY
        // ═════════════════════════════════════════════════
        stage('Deploy to DEV') {
            steps {
                echo "========================================="
                echo "  Deploying to DEV..."
                echo "========================================="
                echo "DEV deployment complete ✅"
            }
        }

        stage('DEV - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on DEV"
                echo "========================================="
                dir('qa-tests') {
                    sh 'rm -rf allure-results reports reporting-labs'
                    withCredentials([
                        usernamePassword(credentialsId: 'dev-credentials',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'dev-base-url', variable: 'URL'),
                        string(credentialsId: 'api-base-url', variable: 'APIBASEURL')
                    ]) {
                        sh '''
                            ENV=nonprod \
                            URL=$URL \
                            USERNAME=$USERNAME \
                            PASSWORD=$PASSWORD \
                            API_BASE_URL=$APIBASEURL \
                            API_TOKEN=$TOKEN \
                            npx playwright test --grep @uitests  --config=configs/ui.playwright.config.ts 
                        '''
                    }
                }
            }
            post {
                always {
                    sh 'mkdir -p reports-dev/html reports-dev/allure reports-dev/reportinglabs'
                    sh 'cp -r qa-tests/reports/ui-html-report/* reports-dev/html/ || true'
                    sh 'allure generate qa-tests/allure-results --clean -o reports-dev/allure || true'
                    publishHTML(target: [
                        reportName: 'DEV Sanity - PW HTML Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'DEV Sanity - Allure Report',
                        reportDir: 'reports-dev/allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 4: DEPLOY PROD + SMOKE (with approval)
        // ═════════════════════════════════════════════════
        stage('Approval for PROD') {
            steps {
                input message: 'Deploy to PROD?',
                    ok: 'Yes, Deploy!',
                    submitter: 'admin,anil,qa-teamgit '
            }
        }

        stage('Deploy to PROD') {
            steps {
                echo "========================================="
                echo "  Deploying to PROD..."
                echo "========================================="
                echo "PROD deployment complete ✅"
            }
        }
    } // <--- Closes 'stages' correctly

    // ═════════════════════════════════════════════════════
    // POST — CONSOLIDATED EMAIL ACTIONS
    // ═════════════════════════════════════════════════════
    post {
        success {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ✅ SUCCESS'
            echo '═══════════════════════════════════════════'
            mail to: 'qa-alerts@test.local',
                 subject: "SUCCESS: Playwright Suite Passed [Build #${env.BUILD_NUMBER}]",
                 body: "All automated test cases finished successfully. View details in Jenkins."
        }
        failure {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ❌ FAILED'
            echo '═══════════════════════════════════════════'
            mail to: 'qa-alerts@test.local',
                 subject: "FAILURE: Playwright Suite Failed [Build #${env.BUILD_NUMBER}]",
                 body: "Attention: One or more Playwright tests failed. Please review the reports in Jenkins immediately."
        }
    }
} 