input_t = 1006401
input_s = '17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,449,x,x,x,x,x,x,x,23,x,x,x,x,13,x,x,x,x,x,19,x,x,x,x,x,x,x,x,x,x,x,607,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29'
# input_s = '1789,37,47,1889'
# input_s = '17,x,13,19'
# input_s = '67,7,x,59,61'
input_s = input_s.split ','

#1
# pp buses1 = input_s.filter { |i| i != 'x' }.map(&:to_i).sort
# pp buses1.map { |b| input_t / b * b + b - input_t }

#2
bus_data = []
i = 0
input_s.each { |b|
	bus_data.push [b.to_i, i] if b != 'x'
	i += 1
}

matches = [0]
matches_found = 1

t = 0
t_step = bus_data[0][0]

while true
	t += t_step

	for b in matches_found..bus_data.size-1
		break	if (t + bus_data[b][1]) % bus_data[b][0] > 0

		if matches[b].nil?
			matches[b] = t
		else
			matches_found += 1
			t_step = t - matches[b]
			pp "match #{b}: #{bus_data[b][0]}, new step: #{t_step}"
		end
	end

	break if matches_found == bus_data.size
end

pp t - t_step
