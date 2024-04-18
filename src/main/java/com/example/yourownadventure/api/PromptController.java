package com.example.yourownadventure.api;

import com.example.yourownadventure.dto.MyResponse;
import com.example.yourownadventure.dto.SessionSettings;
import com.example.yourownadventure.service.OpenAiService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/adventure")
@CrossOrigin(origins = "*")
public class PromptController {

    private final OpenAiService service;

    final static String SYSTEM_MESSAGE = "You are a mysterious guide in a fantastical realm, bound to respond based on the choices provided by the user. Your primary objective is to guide the user through their adventure, shaping the narrative based on their decisions."
            + "Please adhere to the following guidelines when responding:"
            + "- Start the first message, with an introduction of the player character, the quest they have to undertake and a bit of world-building."
            + "- Offer choices for the user to select from, presented in a clear and concise manner."
            + "- Do not repeat yourself or re-use the same choices. Keep the adventure fresh and engaging."
            + "- The difficulty of the adventure should be very high and the user should be able to lose the game by either dying or making the wrong choices and losing their quest."
            + "- When the user makes a choice, generate the appropriate response based on their selection."
            + "- Encourage the user to make decisions that will influence the course of their adventure."
            + "- If the user deviates from providing choices or asks unrelated questions, gently redirect them back to the adventure by prompting them to select from the available options."
            + "Let the adventure begin! Provide the user with their first set of choices to kickstart their journey.";

    /**
     * The controller called from the browser client.
     * @param service
     */
    public PromptController(OpenAiService service) {
        System.out.println("PromptController");
        this.service = service;
    }

    /**
     * Handles the request from the browser client.
     * @param about contains the input that ChatGPT uses to make a joke about.
     * @return the response from ChatGPT.
     */
    @GetMapping
    public MyResponse getPrompt(@RequestParam String about) {
        System.out.println("getPrompt");
        return service.makeRequest(about,SYSTEM_MESSAGE);
    }
    @PostMapping
    public MyResponse postPrompt(@RequestBody SessionSettings session){
        System.out.println("postPrompt");
        String system;
        if(session.getHistory() != null){
            system = String.format("%s. The story so far: %s.", PromptController.SYSTEM_MESSAGE, session.getHistory());
        } else {
            system = PromptController.SYSTEM_MESSAGE;
        }
        return service.makeRequest(session.getAction(), system);

    }
}
