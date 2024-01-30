// Import necessary functions from Jest
import { jest, describe, it, expect } from '@jest/globals';
import { LogUtils } from './LogUtils';


// Tests for the LogUtils object
describe('LogUtils', () => {
    it('should log errors with the correct prefix and styles', () => {
        // Create a spy for the error function passed as an argument
        const errorSpy = jest.spyOn(console, 'error');

        // Call the error method of LogUtils with a test message
        LogUtils.error('Test Error');

        // Verify that the error function was called with the correct arguments
        expect(errorSpy).toHaveBeenCalledWith('%c[ERR] %cTest Error', 'color: #d32f2f; font-weight: bold', 'color: inherit, font-weight: none');
    });

    it('should log debug messages with the correct prefix and styles', () => {
        // Create a spy for the debug function passed as an argument
        const debugSpy = jest.spyOn(console, 'debug');

        // Call the debug method of LogUtils with a test message
        LogUtils.debug('Test Debug');

        // Verify that the debug function was called with the correct arguments
        expect(debugSpy).toHaveBeenCalledWith('%c[DEBUG] %cTest Debug', 'color: #ed6c02; font-weight: bold', 'color: inherit, font-weight: none');
    });

    it('should log info messages with the correct prefix and styles', () => {
        // Create a spy for the info function passed as an argument
        const infoSpy = jest.spyOn(console, 'info');

        // Call the info method of LogUtils with a test message
        LogUtils.info('Test Info');

        // Verify that the info function was called with the correct arguments
        expect(infoSpy).toHaveBeenCalledWith('%c[INFO] %cTest Info', 'color: #0288d1; font-weight: bold', 'color: inherit, font-weight: none');
    });
});
