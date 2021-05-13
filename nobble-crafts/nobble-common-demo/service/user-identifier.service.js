class UserIdentifierService {

    static byRequest(request) {
        return "nobble-crafts-demo";
    }

    static auto() {
        return "nobble-crafts-demo";
    }
}

module.exports = UserIdentifierService;