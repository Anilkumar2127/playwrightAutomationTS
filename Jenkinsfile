// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline
// Playwright TypeScript Framework
// Anil Automation
// ═══════════════════════════════════════════════════════════════

pipeline {
    agent any

    triggers {
        pollSCM('*/10 * * * *')
    }

    tools {
        nodejs 'nodejs'
        maven 'maven'
        jdk 'Java'
        allure 'allure'
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'msedge', 'chrome'],
            description: 'Select browser'
        )
    }

    options {
        timeout(time: 45, unit: 'MINUTES') // Extended timeout for all 4 stages
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
                    bat 'npm install'
                    bat 'npx playwright install --with-deps ${params.BROWSER}'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 2: DEPLOY DEV
        // ═════════════════════════════════════════════════
        stage('Deploy to DEV') {
            steps {
                echo "========================================="
                echo "  Deploying to DEV..."
                echo "========================================="
                echo "DEV deployment complete ✅"
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 3: DEV-API TESTS
        // ═════════════════════════════════════════════════
        stage('DEV-API Tests') {
            steps {
                echo "========================================="
                echo "  Running API Tests on DEV"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'nonprod',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'non-prod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        bat '''
                            set ENV=nonprod
                            set URL=%URL%
                            set USERNAME=%USERNAME%
                            set PASSWORD=%PASSWORD%
                            set API_BASE_URL=%APIBASEURL%
                            set API_TOKEN=%TOKEN%
                            npx playwright test --grep @apiCalls --config=configs/api.playwright.config.ts
                        '''
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-dev\\api-html mkdir reports-dev\\api-html'
                    bat 'xcopy /E /Y qa-tests\\playwright-report\\* reports-dev\\api-html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: '1. DEV - PW API Report',
                        reportDir: 'reports-dev/api-html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 4: DEV - UI SANITY TESTS
        // ═════════════════════════════════════════════════
        stage('DEV - UI Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running UI Sanity Tests (@smoke) on DEV"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'nonprod',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'non-prod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        bat """
                            set ENV=nonprod
                            set BROWSER=${params.BROWSER}
                            set URL=%URL%
                            set USERNAME=%USERNAME%
                            set PASSWORD=%PASSWORD%
                            set API_BASE_URL=%APIBASEURL%
                            set API_TOKEN=%TOKEN%
                            npx playwright test --grep @smoke --config=configs/ui.playwright.config.ts
                        """
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-dev\\ui-html mkdir reports-dev\\ui-html'
                    // Usinag your ui configuration output path: reports/ui-html-report
                    bat 'xcopy /E /Y qa-tests\\reports\\ui-html-report\\* reports-dev\\ui-html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: '2. DEV - PW UI Report',
                        reportDir: 'reports-dev/ui-html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
    }
}
