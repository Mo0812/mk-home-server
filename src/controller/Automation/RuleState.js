const logger = require("../../system/Logger/Logger");
const rules = require("./Rules");
const ruleType = require("./RuleType");
const protocol = require("./Protocol");

const _generateRuleState = async (rule) => {
    try {
        var peopleState = null;
        switch (rule.mode) {
            case ruleType.present:
                peopleState = await protocol.getCurrentPeopleState();
                rule.active = peopleState.type == "return";
                break;
            case ruleType.away:
                peopleState = await protocol.getCurrentPeopleState();
                rule.active = peopleState.type == "go";
                break;
            case ruleType.always:
                rule.active = true;
                break;
            case ruleType.scheduled:
                rule.active = false;
                break;
            default:
                throw new Error("Could not find type");
        }
        return rule;
    } catch (error) {
        logger.log("error", "Automation/RuleState: " + error.message);
    }
};

const getRuleState = async (ruleId) => {
    try {
        const rule = await rules.getById(ruleId);
        await _generateRuleState(rule);
        return rule;
    } catch (error) {
        logger.log("error", "Automation/RuleState: " + error.message);
    }
};

const getAllRuleStates = async () => {
    try {
        const ruleCollection = await rules.getAll();
        const ruleStateCollection = Promise.all(
            ruleCollection.map(_generateRuleState)
        );
        return ruleStateCollection;
    } catch (error) {
        logger.log("error", "Automation/RuleState: " + error.message);
    }
};

const getActiveRuleStates = async () => {
    const ruleStates = await getAllRuleStates();
    return ruleStates.filter((item) => item.active);
};

module.exports = {
    getRuleState,
    getAllRuleStates,
    getActiveRuleStates,
};
