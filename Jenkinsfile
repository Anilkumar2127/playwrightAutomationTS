// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline
// Playwright TypeScript Framework
// Anil Automation
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

pipeline {
    agent any

    triggers{
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
            choices: ['chromium', 'firefox', 'webkit','msedge','chrome'],
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
                        // FIX: Windows Batch Environment Syntax
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
                    // FIX: Standard Windows pathing and directory creation
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    
                    // FIX: Replaced 'cp' with Windows 'xcopy' and fixed '|| true' syntax
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
        stage('DEV -UI Sanity Tests') {
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
                        string(credentialsId: 'non-prod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        // FIX: Windows Batch Environment Syntax
                        bat '''
                            set ENV=nonprod
                            set BROWSER=%BROWSER%
                            set URL=%URL%
                            set USERNAME=%USERNAME%
                            set PASSWORD=%PASSWORD%
                            set API_BASE_URL=%APIBASEURL%
                            set API_TOKEN=%TOKEN%
                            npx playwright test --grep @smoke  --config=configs/ui.playwright.config.ts
                        '''
                    }
                }
            }
            post {
                always {
                    // FIX: Standard Windows pathing and directory creation
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
              
                    // FIX: Replaced 'cp' with Windows 'xcopy' and fixed '|| true' syntax
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
        stage('PreProd-API Tests') {
            steps {
                echo "========================================="
                echo "  Running API Tests on DEV"
                echo "========================================="
                dir('qa-tests') {
                    withCredentials([
                        usernamePassword(credentialsId: 'preprod-env',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'preprod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        // FIX: Windows Batch Environment Syntax
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
                    // FIX: Standard Windows pathing and directory creation
                    bat 'if not exist reports-dev\\html mkdir reports-dev\\html'
                    
                    // FIX: Replaced 'cp' with Windows 'xcopy' and fixed '|| true' syntax
                    bat 'xcopy /E /Y qa-tests\\reports\\api-html-report\\* reports-dev\\html\\ || exit 0'
                    
                    publishHTML(target: [
                        reportName: 'preprod - PW API Report',
                        reportDir: 'reports-dev/html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
        stage('preprod ui - Sanity Tests') {
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
                        usernamePassword(credentialsId: 'preprod',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'TOKEN'),
                        string(credentialsId: 'preprod-url', variable: 'URL'),
                        string(credentialsId: 'api-url', variable: 'APIBASEURL')
                    ]) {
                        // FIX: Windows Batch Environment Syntax
                        bat '''
                            set ENV=preprod
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
           
                    
                    // FIX: Replaced 'cp' with Windows 'xcopy' and fixed '|| true' syntax
                    bat 'xcopy /E /Y qa-tests\\reports\\ui-html-report\\* reports-dev\\html\\ || exit 0'
                  
                    
                    publishHTML(target: [
                        reportName: 'preprod Sanity - ui-Report',
                        reportDir: 'reports-dev/html',
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
    } 

    // ═════════════════════════════════════════════════════
    // POST — CONSOLIDATED EMAIL ACTIONS
    // ═════════════════════════════════════════════════════
    post {
        success {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ✅ SUCCESS'
            echo '═══════════════════════════════════════════'
            mail to: 'qa-team@test.local',
                 subject: "SUCCESS: Playwright Suite Passed [Build #${env.BUILD_NUMBER}]",
                 body: "All automated test cases finished successfully. View details in Jenkins."
        }
        failure {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ❌ FAILED'
            echo '═══════════════════════════════════════════'
            mail to: 'qa-team@test.local',
                 subject: "FAILURE: Playwright Suite Failed [Build #${env.BUILD_NUMBER}]",
                 body: "Attention: One or more Playwright tests failed. Please review the reports in Jenkins immediately."
        }
    }
} 