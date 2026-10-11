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
                    // UPDATED: Standard npm install and global playwright binary downloads
                    bat 'npm install'
                    bat 'npx playwright install'
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
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    bat 'xcopy /E /Y qa-tests\\reports\\api-html-report\\* reports-dev\\html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: 'dev - PW API Report',
                        reportDir: 'reports-dev/html',
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
        stage('DEV -UI Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on DEV"
                echo "========================================="
                dir('qa-tests') {
                    bat 'if exist allure-results rmdir /s /q allure-results'
                    bat 'if exist reports rmdir /s /q reports'
                    bat 'if exist reporting-labs rmdir /s /q reporting-labs'
                    
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
                            npx playwright test --grep @smoke --config=configs/ui.playwright.config.ts --project=${params.BROWSER}
                        """
                    }
                }
            }
            post {
                always {
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    bat 'xcopy /E /Y qa-tests\\reports\\ui-html-report\\* reports-dev\\html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: 'DEV sanity-ui-Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 5: PREPROD-API TESTS
        // ═════════════════════════════════════════════════
        stage('PreProd-API Tests') {
            steps {
                echo "========================================="
                echo "  Running API Tests on PREPROD"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'preprod-env',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'preprod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        bat '''
                            set ENV=preprod
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
                    bat 'if not exist reports-preprod\\html mkdir reports-preprod\\html'
                    bat 'xcopy /E /Y qa-tests\\reports\\api-html-report\\* reports-preprod\\html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: 'PreProd - PW API Report',
                        reportDir: 'reports-preprod/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
    }
}