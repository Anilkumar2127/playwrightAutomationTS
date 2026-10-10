// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline
// Playwright TypeScript Framework
// Anil Automation
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

pipeline {
    agent any

    tools {
        nodejs 'nodejs'
        maven 'maven'
        jdk 'Java'
        allure 'allure'
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['nonprod'],
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
        // STAGE 1: INSTALL PLAYWRIGHT DEPENDENCIES
        // ═════════════════════════════════════════════════
        stage('Install Dependencies') {
            steps {
                echo "========================================="
                echo "  Installing Playwright Dependencies"
                echo "========================================="
                dir('qa-tests') {
                    git url: 'https://github.com/Anilkumar2127/playwrightAutomationTS',
                        branch: 'main'
                    bat 'npm ci'
                    bat 'npx playwright install --with-deps chromium'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 2: DEPLOY DEV + SANITY
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
                    // FIX: Safe directory cleanup using Windows Commands
                    bat 'if exist allure-results rmdir /s /q allure-results'
                    bat 'if exist reports rmdir /s /q reports'
                    bat 'if exist reporting-labs rmdir /s /q reporting-labs'
                    
                    withCredentials([
                        usernamePassword(credentialsId: 'nonprod',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'prod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        // FIX: Windows Batch Environment Syntax
                        bat '''
                            set ENV=nonprod
                            set URL=%URL%
                            set USERNAME=%USERNAME%
                            set PASSWORD=%PASSWORD%
                            set API_BASE_URL=%APIBASEURL%
                            set API_TOKEN=%TOKEN%
                            npx playwright test --grep @uitests --config=configs/ui.playwright.config.ts
                        '''
                    }
                }
            }
            post {
                always {
                    // FIX: Standard Windows pathing and directory creation
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    bat 'if not exist reports-dev\\allure mkdir reports-dev\\allure'
                    
                    // FIX: Replaced 'cp' with Windows 'xcopy' and fixed '|| true' syntax
                    bat 'xcopy /E /Y qa-tests\\reports\\ui-html-report\\* reports-dev\\html\\ || exit 0'
                    bat 'allure generate qa-tests\\allure-results --clean -o reports-dev\\allure || exit 0'
                    
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
        // STAGE 3: DEPLOY PROD + SMOKE (with approval)
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